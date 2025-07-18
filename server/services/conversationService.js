// ELI/server/conversationAPI/conversationService.js
// Handles the business logic for ingesting conversation data.

const pool = require('../database');

const VALID_EVENT_TYPES = ['USER_MESSAGE', 'AGENT_MESSAGE'];
const DB_VECTOR_DIMENSION = 768;


/**
 * Processes and stores a full conversation from Hume AI JSON data into the database.
 * This function wraps all database operations in a single transaction.
 *
 * @param {object} humeData The full JSON object received from the Hume EVI API.
 * @param {string} userEmail The email of the user associated with this conversation.
 * @returns {object} An object containing the success status and the generated chat UUID.
 */
async function ingestConversation(humeData, userEmail) {
    const client = await pool.connect();

    try {
        await client.query('BEGIN'); // Start transaction

        // Step 1: Find the user's UUID from their email.
        const userResult = await client.query('SELECT id FROM users WHERE email = $1', [userEmail]);
        if (userResult.rows.length === 0) {
            throw new Error(`User with email ${userEmail} not found.`);
        }
        const userId = userResult.rows[0].id;

        // Extract main IDs and timestamps from the Hume data
        const { id: chatId, chat_group_id: chatGroupId, start_timestamp, end_timestamp, events_page, config } = humeData;

        // Convert timestamps from milliseconds to PostgreSQL timestamp format
        const startTimestamp = new Date(start_timestamp);
        const endTimestamp = new Date(end_timestamp);

        // Step 2: Ensure the EVI Config exists.
        try {
            const configQuery = `
                INSERT INTO evi_configs (id, name, version, details)
                VALUES ($1, 'Default Ingested Config', $2, '{}'::jsonb);
            `;
            await client.query(configQuery, [config.id, config.version]);
        } catch (error) {
            if (error.code !== '23505') { throw error; }
        }

        // Step 3: Insert or Update the Chat Group
        const chatGroupQuery = `
            INSERT INTO chat_groups (id, first_start_timestamp, most_recent_start_timestamp, num_chats, active)
            VALUES ($1, $2, $3, 1, FALSE)
                ON CONFLICT (id) DO UPDATE SET
                most_recent_start_timestamp = EXCLUDED.most_recent_start_timestamp,
                                        num_chats = chat_groups.num_chats + 1,
                                        updated_at = NOW();
        `;
        await client.query(chatGroupQuery, [chatGroupId, startTimestamp, startTimestamp]);

        // Step 4: Insert the Chat Session
        const chatQuery = `
            INSERT INTO chats (id, chat_group_id, user_id, config_id, status, start_timestamp, end_timestamp, event_count)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                ON CONFLICT (id) DO NOTHING;
        `;
        await client.query(chatQuery, [chatId, chatGroupId, userId, config.id, humeData.status, startTimestamp, endTimestamp, events_page.length]);

        // Step 5: Prepare and Insert all Chat Events
        for (const event of events_page) {

            // Filter events to only include types that exist in the ENUM.
            if (!VALID_EVENT_TYPES.includes(event.type)) {
                console.log(`Skipping event type "${event.type}" as it is not a valid ENUM value.`);
                continue; // Skip to the next event in the loop
            }

            let embeddingVector = null;
            let parsedMetadata = null;
            if (event.metadata && typeof event.metadata === 'string') {
                try {
                    parsedMetadata = JSON.parse(event.metadata);
                } catch (e) {
                    console.error(`Failed to parse metadata for event ${event.id}:`, e);
                    parsedMetadata = null;
                }
            }

            if (event.type === 'USER_MESSAGE' && parsedMetadata?.segments?.[0]?.embedding) {
                let fullEmbedding = parsedMetadata.segments[0].embedding;

                // Ensure fullEmbedding is an array
                if (!Array.isArray(fullEmbedding)) {
                    console.error(`Embedding is not an array for event ${event.id}: ${JSON.stringify(fullEmbedding)}`);
                    continue; // Skip this event
                }

                // Pad or truncate to match DB_VECTOR_DIMENSION (768)
                if (fullEmbedding.length < DB_VECTOR_DIMENSION) {
                    const padding = Array(DB_VECTOR_DIMENSION - fullEmbedding.length).fill(0);
                    fullEmbedding = fullEmbedding.concat(padding);
                } else if (fullEmbedding.length > DB_VECTOR_DIMENSION) {
                    fullEmbedding = fullEmbedding.slice(0, DB_VECTOR_DIMENSION);
                }

                // Verify the length
                if (fullEmbedding.length !== DB_VECTOR_DIMENSION) {
                    console.error(`Embedding length mismatch for event ${event.id}: expected ${DB_VECTOR_DIMENSION}, got ${fullEmbedding.length}`);
                    continue; // Skip to avoid database error
                }

                embeddingVector = `[${fullEmbedding.join(',')}]`;
            }

            const eventQuery = `
                INSERT INTO chat_events (id, chat_id, timestamp, role, type, message_text, emotion_features, embedding)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                    ON CONFLICT (id) DO NOTHING;
            `;

            await client.query(eventQuery, [
                event.id,
                chatId,
                new Date(event.timestamp),
                event.role,
                event.type,
                event.message_text,
                event.emotion_features,
                embeddingVector
            ]);
        }

        await client.query('COMMIT'); // Commit transaction

        return { success: true, chatId: chatId };

    } catch (error) {
        await client.query('ROLLBACK'); // Rollback on error
        console.error('Error during conversation ingestion transaction:', error);
        throw new Error('Failed to ingest conversation data due to a server error.');
    } finally {
        client.release(); // Release the client back to the pool
    }
}

module.exports = {
    ingestConversation,
};
