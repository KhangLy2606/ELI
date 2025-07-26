const { HumeClient } = require("hume");
const { WebSocket } = require("ws");
const { v4: uuidv4 } = require("uuid");
const pool = require("../database");

// Initialize Hume SDK (server‑side).
const hume = new HumeClient({
    apiKey: process.env.HUME_API_KEY,
    secretKey: process.env.HUME_SECRET_KEY, // optional
});



async function simulateChat(socket, dbClient, chatId) {
    const script = [
        "Hi EVI, how are you today?",
        "Tell me a joke about penguins.",
        "Cool! One more fun fact, please.",
        "Thanks – bye!",
    ];

    for (const line of script) {
        await dbClient.query(
            `INSERT INTO chat_events (id, chat_id, timestamp, role, type, message_text)
             VALUES ($1,$2,NOW(),'USER','USER_MESSAGE',$3)`,
            [uuidv4(), chatId, line]
        );
        socket.sendUserInput(line);
        await new Promise((r) => setTimeout(r, 2500));
    }
}


async function handleConnection(clientWs, userId) {
    console.log(`[RealtimeChatService] Connection for user ${userId}`);

    const dbClient = await pool.connect();
    let chatId;
    let chatGroupId;
    let humeSocket;

    try {
        //  Connect to Hume
        humeSocket = await hume.empathicVoice.chat.connect();
        await humeSocket.tillSocketOpen();

        const SIM_MODE = process.env.SIMULATE_CHAT === "true";
        // Create DB entries
        await dbClient.query("BEGIN");
        chatGroupId = (
            await dbClient.query(
                `INSERT INTO chat_groups (id, first_start_timestamp, most_recent_start_timestamp, num_chats, active)
                 VALUES ($1,NOW(),NOW(),1,TRUE) RETURNING id`,
                [uuidv4()]
            )
        ).rows[0].id;

        chatId = (
            await dbClient.query(
                `INSERT INTO chats (id, chat_group_id, user_id, status, start_timestamp)
                 VALUES ($1,$2,$3,'ACTIVE',NOW()) RETURNING id`,
                [uuidv4(), chatGroupId, userId]
            )
        ).rows[0].id;

        await dbClient.query("COMMIT");
        console.log(`[Database] Chat ${chatId} ready (group ${chatGroupId}).`);

        if (SIM_MODE) simulateChat(humeSocket, dbClient, chatId).catch(console.error);

        // Browser → Server → Hume
        clientWs.on("message", async (raw) => {
            const text = raw.toString();
            await dbClient.query(
                `INSERT INTO chat_events (id, chat_id, timestamp, role, type, message_text)
                 VALUES ($1,$2,NOW(),'USER','USER_MESSAGE',$3)`,
                [uuidv4(), chatId, text]
            );
            if (humeSocket.readyState === WebSocket.OPEN) humeSocket.sendUserInput(text);
        });

        // Hume → Server → Browser
        humeSocket.on("message", async (msg) => {
            if (clientWs.readyState !== clientWs.OPEN) return;
            if (msg.type === "assistant_message") {
                await dbClient.query(
                    `INSERT INTO chat_events (id, chat_id, timestamp, role, type, message_text, emotion_features)
                     VALUES ($1,$2,NOW(),'AGENT','AGENT_MESSAGE',$3,$4::jsonb)`,
                    [uuidv4(), chatId, msg.message.content, msg.models?.prosody?.scores || {}]
                );
            }
            clientWs.send(JSON.stringify(msg));
        });

        // Keep function alive until either socket closes
        await new Promise((resolve) => {
            let settled = false;
            const once = () => {
                if (!settled) {
                    settled = true;
                    resolve();
                }
            };
            clientWs.once ? clientWs.once("close", once) : clientWs.on("close", once);
            humeSocket.on("close", once);
            humeSocket.on("error", once);
            clientWs.on("error", once);

        });
    } catch (err) {
        console.error("[RealtimeChatService] Error:", err);
        try {
            await dbClient.query("ROLLBACK");
        } catch {}
        if (clientWs.readyState === clientWs.OPEN) {
            clientWs.send(JSON.stringify({ type: "error", message: "Server error" }));
        }
    }

    finally {
        console.log(`[RealtimeChatService] Cleaning up for user ${userId}`);

        // Gracefully close Hume socket
        try {
            if (humeSocket && humeSocket.readyState === WebSocket.OPEN) {
                humeSocket.close();
            }
        } catch (err) {
            console.error("[RealtimeChatService] Error closing Hume socket:", err);
        }

        // Update chat status
        if (chatId) {
            try {
                await dbClient.query(
                    `UPDATE chats SET status='COMPLETE', end_timestamp=NOW() WHERE id=$1`,
                    [chatId]
                );
            } catch (err) {
                console.error("[RealtimeChatService] Error updating chat status:", err);
            }
        }

        // Update chat group status
        if (chatGroupId) {
            try {
                await dbClient.query(
                    `UPDATE chat_groups SET active=FALSE, updated_at=NOW() WHERE id=$1`,
                    [chatGroupId]
                );
            } catch (err) {
                console.error("[RealtimeChatService] Error updating chat group:", err);
            }
        }

        // ALWAYS release the database client
        dbClient.release();

        // Gracefully close client socket
        try {
            if (clientWs.readyState === clientWs.OPEN) {
                clientWs.close();
            }
        } catch (err) {
            console.error("[RealtimeChatService] Error closing client socket:", err);
        }
    }
}

module.exports = { handleConnection };
