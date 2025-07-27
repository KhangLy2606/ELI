// server/services/eviService.js
const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');
const pool = require('../database');
const { ChatStatus, EventRole, EventType } = require('../constants/dbEnums');

/**
 * Parses a message from Hume's WebSocket to fit the chat_events schema.
 * @param {object} humeMessage - The parsed JSON message from Hume.
 * @returns {object | null} A structured object for DB insertion, or null if the event should be skipped.
 */
const parseHumeEventForDb = (humeMessage) => {
    const { type, message, models, tool_call } = humeMessage;

    let role;
    let dbType;
    let messageText = message?.content || null;

    switch (type) {
        case 'user_message':
            role = EventRole.USER;
            dbType = EventType.USER_MESSAGE;
            break;
        case 'assistant_message':
            role = EventRole.AGENT;
            dbType = EventType.AGENT_MESSAGE;
            break;
        case 'tool_call':
            role = EventRole.AGENT;
            dbType = EventType.TOOL_CALL;
            break;
        case 'error':
        case 'user_interruption':
        case 'assistant_end':
        case 'audio_output':
            // These events are not mapped in dbEnums.js or are not needed for logging.
            return null;
        default:
            return null;
    }

    return {
        role,
        type: dbType,
        message_text: messageText,
        emotion_features: models?.prosody?.scores || null,
        tool_call_data: tool_call || null,
    };
};

/**
 * Logs a single chat event from the conversation into the database.
 * @param {object} dbClient - An active database client from the pool.
 * @param {string} chatId - The UUID of the chat session.
 * @param {object} humeEventData - The original JSON data object from Hume.
 */
const logChatEvent = async (dbClient, chatId, humeEventData) => {
    const event = parseHumeEventForDb(humeEventData);
    if (!event) return;

    const query = `
        INSERT INTO chat_events (id, chat_id, "timestamp", role, type, message_text, emotion_features, tool_call_data)
        VALUES ($1, $2, NOW(), $3, $4, $5, $6, $7);
    `;
    const values = [
        uuidv4(),
        chatId,
        event.role,
        event.type,
        event.message_text,
        event.emotion_features ? JSON.stringify(event.emotion_features) : null,
        event.tool_call_data ? JSON.stringify(event.tool_call_data) : null,
    ];

    try {
        await dbClient.query(query, values);
    } catch (dbError) {
        console.error(`[EviService] DB Error logging event for chat ${chatId}:`, dbError);
    }
};


/**
 * Handles a new WebSocket connection for the Empathic Voice Interface.
 * This function orchestrates the proxy between the client and the Hume API for both voice and chat.
 * @param {WebSocket} clientWs - The WebSocket connection from the client.
 * @param {string} userId - The authenticated user's UUID from the JWT.
 */
const handleConnection = async (clientWs, userId) => {
    console.log(`[EviService] Connection established for user ${userId}. Waiting for session configuration.`);

    const dbClient = await pool.connect();
    let humeSocket;
    let chatId;
    let chatGroupId;

    // 1. Listen for messages from the client
    clientWs.on('message', async (message) => {
        // If humeSocket is not yet created, this must be the initial configuration message.
        if (!humeSocket) {
            try {
                const config = JSON.parse(message);

                if (config.type === 'start_session') {
                    console.log(`[EviService] Received start_session for user ${userId}.`);
                    const { profile_id, config_id, custom_session_id, modality } = config.payload;

                    // Validate modality
                    if (modality !== 'chat' && modality !== 'voice') {
                        return clientWs.close(1008, "Invalid session modality. Must be 'chat' or 'voice'.");
                    }

                    // Security Check: Ensure the requested profile belongs to the authenticated user.
                    const profileCheck = await dbClient.query('SELECT id FROM profiles WHERE id = $1 AND user_id = $2', [profile_id, userId]);
                    if (profileCheck.rows.length === 0) {
                        return clientWs.close(1008, 'Unauthorized or invalid profile ID.');
                    }

                    // Create database entries for the new session
                    await dbClient.query("BEGIN");

                    chatGroupId = (await dbClient.query(
                        `INSERT INTO chat_groups (id, first_start_timestamp, most_recent_start_timestamp, num_chats, active)
                         VALUES ($1, NOW(), NOW(), 1, TRUE) RETURNING id`,
                        [uuidv4()]
                    )).rows[0].id;

                    chatId = (await dbClient.query(
                        `INSERT INTO chats (id, chat_group_id, profile_id, config_id, status, start_timestamp, custom_session_id, metadata)
                         VALUES ($1, $2, $3, $4, $5, NOW(), $6, $7) RETURNING id`,
                        [uuidv4(), chatGroupId, profile_id, config_id, ChatStatus.ACTIVE, custom_session_id, { modality }]
                    )).rows[0].id;

                    await dbClient.query("COMMIT");
                    console.log(`[EviService] New chat created in DB with ID: ${chatId} (Modality: ${modality})`);

                    // Establish the WebSocket connection to Hume AI
                    const humeApiKey = process.env.HUME_API_KEY;
                    if (!humeApiKey) {
                        console.error("[EviService] FATAL: HUME_API_KEY environment variable not set.");
                        return clientWs.close(1011, 'Server configuration error.');
                    }

                    humeSocket = new WebSocket('wss://api.hume.ai/v0/evi/chat', {
                        headers: { 'X-Hume-Api-Key': humeApiKey }
                    });

                    // --- Hume Socket Event Handlers ---
                    humeSocket.on('open', () => {
                        console.log(`[EviService] Connection to Hume AI established for chat ${chatId}.`);
                        // Inform client that the session is ready
                        clientWs.send(JSON.stringify({ type: 'session_ready', chatId }));
                    });

                    humeSocket.on('message', (humeMessage) => {
                        const parsedMessage = JSON.parse(humeMessage);
                        // Log the event to our database
                        logChatEvent(dbClient, chatId, parsedMessage);
                        // Forward the message to the client
                        if (clientWs.readyState === WebSocket.OPEN) {
                            clientWs.send(humeMessage.toString());
                        }
                    });

                    humeSocket.on('error', (error) => {
                        console.error(`[EviService] Hume WebSocket error for chat ${chatId}:`, error);
                        if (clientWs.readyState === WebSocket.OPEN) {
                            clientWs.send(JSON.stringify({ type: 'error', message: 'Hume connection error.' }));
                        }
                    });

                    humeSocket.on('close', (code, reason) => {
                        console.log(`[EviService] Hume WebSocket closed for chat ${chatId}. Code: ${code}, Reason: ${reason}`);
                        if (clientWs.readyState === WebSocket.OPEN) {
                            clientWs.close(1000, 'Session ended');
                        }
                    });

                } else {
                    clientWs.close(1002, 'Protocol error: First message must be start_session.');
                }
            } catch (error) {
                console.error('[EviService] Failed to start session:', error);
                await dbClient.query("ROLLBACK").catch(rbErr => console.error("Rollback failed:", rbErr));
                clientWs.close(1011, 'Failed to initialize session.');
            }
            return; // End processing for the config message
        }

        // If the message is binary, it's audio data. Proxy it directly.
        if (Buffer.isBuffer(message)) {
            if (humeSocket?.readyState === WebSocket.OPEN) {
                humeSocket.send(message);
            }
        } else {
            // Otherwise, text input.
            try {
                const command = JSON.parse(message);
                if (command.type === 'user_input' && command.text) {
                    if (humeSocket?.readyState === WebSocket.OPEN) {
                        // Forward the text input to Hume in the required format
                        humeSocket.send(JSON.stringify({
                            type: "user_input",
                            text: command.text,
                        }));
                    }
                }
            } catch(e) {
                console.warn("[EviService] Received invalid non-binary message:", message);
            }
        }
    });

    // 3. Define cleanup logic for when the client disconnects
    clientWs.on('close', async () => {
        console.log(`[EviService] Client for user ${userId} disconnected.`);
        if (humeSocket) {
            humeSocket.close();
        }
        if (chatId) {
            await dbClient.query(`UPDATE chats SET status = $1, end_timestamp = NOW() WHERE id = $2`, [ChatStatus.COMPLETE, chatId])
                .catch(err => console.error("[EviService] Error updating chat status:", err));
        }
        if (chatGroupId) {
            await dbClient.query(`UPDATE chat_groups SET active=FALSE, updated_at=NOW() WHERE id=$1`, [chatGroupId])
                .catch(err => console.error("[EviService] Error updating chat group:", err));
        }
        dbClient.release(); // Release the database client back to the pool
        console.log(`[EviService] Cleaned up resources for user ${userId}.`);
    });

    clientWs.on('error', (error) => {
        console.error(`[EviService] Client WebSocket error for user ${userId}:`, error);
        if (humeSocket) {
            humeSocket.close();
        }
    });
};

module.exports = { handleConnection };