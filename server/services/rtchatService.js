const { HumeClient } = require("hume");
const { WebSocket } = require("ws");
const { v4: uuidv4 } = require("uuid");
const pool = require("../database");

// Initialize Hume SDK (server-side).
const hume = new HumeClient({
    apiKey: process.env.HUME_API_KEY,
    secretKey: process.env.HUME_SECRET_KEY,
});

/**
 * Simulates a user conversation for testing purposes.
 * @param {object} socket - The Hume WebSocket connection.
 * @param {object} dbClient - The database client.
 * @param {string} chatId - The ID of the chat to add events to.
 */
async function simulateChat(socket, dbClient, chatId) {
    const script = [
        "Hi EVI, how are you today?",
        "Tell me a joke about penguins.",
        "Cool! One more fun fact, please.",
        "Thanks – bye!",
    ];

    for (const line of script) {
        await dbClient.query(
            `INSERT INTO chat_events (id, chat_id, "timestamp", role, type, message_text)
             VALUES ($1, $2, NOW(), 'user', 'user_message', $3)`,
            [uuidv4(), chatId, line]
        );
        socket.sendUserInput(line);
        await new Promise((r) => setTimeout(r, 2500));
    }
}

/**
 * Handles a new WebSocket connection for a real-time chat session.
 * @param {object} clientWs - The client's WebSocket connection.
 * @param {string} userId - The authenticated user's ID.
 */
async function handleConnection(clientWs, userId) {
    console.log(`[RealtimeChatService] Connection for user ${userId}`);

    const dbClient = await pool.connect();
    let chatId;
    let chatGroupId;
    let humeSocket;

    try {
        console.log('[RealtimeChatService] Step 1: Connecting to Hume API...');
        humeSocket = await hume.empathicVoice.chat.connect();
        await humeSocket.tillSocketOpen();
        console.log('[RealtimeChatService] Step 1 Complete: Hume API connected.');
        console.log('[RealtimeChatService] Step 2: Creating database entries...');
        await dbClient.query("BEGIN");

        const profileResult = await dbClient.query('SELECT id FROM profiles WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1', [userId]);

        if (profileResult.rows.length === 0) {
            throw new Error(`No profile found for user ${userId}`);
        }
        const profileId = profileResult.rows[0].id;

        chatGroupId = (
            await dbClient.query(
                `INSERT INTO chat_groups (id, first_start_timestamp, most_recent_start_timestamp, num_chats, active)
                 VALUES ($1, NOW(), NOW(), 1, TRUE) RETURNING id`,
                [uuidv4()]
            )
        ).rows[0].id;

        chatId = (
            await dbClient.query(
                `INSERT INTO chats (id, chat_group_id, profile_id, status, start_timestamp)
                 VALUES ($1, $2, $3, 'ACTIVE', NOW()) RETURNING id`,
                [uuidv4(), chatGroupId, profileId]
            )
        ).rows[0].id;

        await dbClient.query("COMMIT");
        console.log(`[RealtimeChatService] Step 2 Complete: Chat ${chatId} ready for profile ${profileId}.`);
        console.log('[RealtimeChatService] Step 3: Setting up message listeners...');

        // Browser → Server → Hume
        clientWs.on("message", async (raw) => {
            const text = raw.toString();
            console.log(`[Client → Hume] Forwarding message: ${text}`);
            if (humeSocket.readyState === WebSocket.OPEN) {
                humeSocket.sendUserInput(text);
            }
        });

        // Hume → Server → Browser
        humeSocket.on("message", async (msg) => {
            if (clientWs.readyState !== clientWs.OPEN) return;
            clientWs.send(JSON.stringify(msg));
            try {
                if (msg.type === "user_message") {
                    await dbClient.query(
                        `INSERT INTO chat_events (id, chat_id, "timestamp", role, type, message_text, emotion_features)
                         VALUES ($1, $2, NOW(), 'user', 'user_message', $3, $4::jsonb)`,
                        [uuidv4(), chatId, msg.message.content, msg.models?.prosody?.scores || {}]
                    );
                } else if (msg.type === "assistant_message") {
                    await dbClient.query(
                        `INSERT INTO chat_events (id, chat_id, "timestamp", role, type, message_text, emotion_features)
                         VALUES ($1, $2, NOW(), 'assistant', 'assistant_message', $3, $4::jsonb)`,
                        [uuidv4(), chatId, msg.message.content, msg.models?.prosody?.scores || {}]
                    );
                }
            } catch (dbError) {
                console.error("[RealtimeChatService] Failed to insert chat event:", dbError);
            }
        });
        console.log('[RealtimeChatService] Step 3 Complete: Message listeners are active.');
        console.log('[RealtimeChatService] Step 4: Waiting for connection to close...');
        await new Promise((resolve) => {
            let settled = false;
            const once = (source, event, ...args) => {
                if (!settled) {
                    console.log(`[RealtimeChatService] Promise resolving due to '${event}' event from ${source}.`, ...args);
                    settled = true;
                    resolve();
                }
            };

            clientWs.once('close', (code, reason) => once('clientWs', 'close', { code, reason: reason.toString() }));
            clientWs.once('error', (err) => once('clientWs', 'error', err));
            humeSocket.on('close', (code, reason) => once('humeSocket', 'close', { code, reason: reason.toString() }));
            humeSocket.on('error', (err) => once('humeSocket', 'error', err));
        });

    } catch (err) {
        console.error("[RealtimeChatService] An error occurred in the main try block:", err);
        try {
            await dbClient.query("ROLLBACK");
        } catch (rollbackErr) {
            console.error("[RealtimeChatService] Error rolling back transaction:", rollbackErr);
        }
        if (clientWs.readyState === clientWs.OPEN) {
            clientWs.send(JSON.stringify({ type: "error", message: "Server error during chat initialization." }));
        }
    } finally {
        console.log(`[RealtimeChatService] Cleaning up resources for user ${userId}`);

        if (humeSocket && humeSocket.readyState === WebSocket.OPEN) {
            console.log('[RealtimeChatService] Closing Hume socket.');
            humeSocket.close();
        }

        if (chatId) {
            await dbClient.query(
                `UPDATE chats SET status='COMPLETE', end_timestamp=NOW() WHERE id=$1`,
                [chatId]
            ).catch(err => console.error("[RealtimeChatService] Error updating chat status:", err));
        }

        if (chatGroupId) {
            await dbClient.query(
                `UPDATE chat_groups SET active=FALSE, updated_at=NOW() WHERE id=$1`,
                [chatGroupId]
            ).catch(err => console.error("[RealtimeChatService] Error updating chat group:", err));
        }

        dbClient.release();
        console.log('[RealtimeChatService] Database client released.');

        if (clientWs.readyState === clientWs.OPEN) {
            console.log('[RealtimeChatService] Closing client socket.');
            clientWs.close();
        }
    }
}

module.exports = { handleConnection };
