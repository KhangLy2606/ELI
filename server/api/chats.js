// server/api/chats.js
const express = require('express');
const pool = require('../database');
const { authenticateToken } = require('../middleware/authJWT');
const { ingestConversation } = require('../services/conversationService');

const router = express.Router();

// This middleware protects all routes in this file
router.use(authenticateToken);

/**
 * Helper function to check if a user owns a specific chat.
 * A user owns a chat if the chat's profile_id belongs to the user.
 * @param {string} userId - The ID of the authenticated user.
 * @param {string} chatId - The ID of the chat to check.
 * @returns {Promise<boolean>} - True if the user owns the chat, false otherwise.
 */
const checkChatOwnership = async (userId, chatId) => {
    const query = `
        SELECT p.user_id 
        FROM chats c
        JOIN profiles p ON c.profile_id = p.id
        WHERE c.id = $1;
    `;
    const result = await pool.query(query, [chatId]);
    if (result.rows.length === 0) {
        return false;
    }
    return result.rows[0].user_id === userId;
};


// GET /api/chats - Fetch all chats for the authenticated user
router.get('/', async (req, res) => {
    const { userId, email } = req.user;
    try {
        const query = `
            SELECT c.id, c.start_timestamp, c.event_count
            FROM chats c
                     JOIN profiles p ON c.profile_id = p.id
            WHERE p.user_id = $1
            ORDER BY c.start_timestamp DESC;
        `;
        const result = await pool.query(query, [userId]);
        res.json(result.rows);
    }catch (error) {
        console.error(`[GET /api/chats] Error fetching chat history for user ${email}:`, error);
        res.status(500).json({ message: 'Server error while fetching chats.' });
    }
});

// GET /api/chats/:chatId - Fetch all events for a specific chat
router.get('/:chatId', async (req, res) => {
    const { chatId } = req.params;
    const { userId, email } = req.user;
    try {
        const isOwner = await checkChatOwnership(userId, chatId);
        if (!isOwner) {
            console.warn(`[GET /api/chats/:chatId] User ${email} attempted to access unowned chat ${chatId}`);
            return res.status(404).json({ message: 'Chat not found or access denied.' });
        }
        const result = await pool.query(
            "SELECT role, type, message_text, emotion_features, timestamp FROM chat_events WHERE chat_id = $1 ORDER BY timestamp ASC",
            [chatId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error(`[GET /api/chats/:chatId] Error fetching details for chat ${chatId} by user ${email}:`, error);
        res.status(500).json({ message: 'Server error while fetching chat details.' });
    }
});

// GET /api/chats/:chatId/analytics - Get analytics for a single chat
router.get('/:chatId/analytics', async (req, res) => {
    const { chatId } = req.params;
    const { userId, email } = req.user;
    try {
        // MODIFICATION: Added ownership check for security.
        const isOwner = await checkChatOwnership(userId, chatId);
        if (!isOwner) {
            console.warn(`[GET /api/chats/:chatId/analytics] USER ${email} attempted to access unowned chat ${chatId}`);
            return res.status(404).json({ message: 'Chat not found or access denied.' });
        }

        const analyticsQuery = `
            SELECT key AS emotion, AVG((value::numeric)) AS average_score
            FROM chat_events, jsonb_each_text(emotion_features)
            WHERE chat_id = $1 AND role = 'USER'
            GROUP BY key
            ORDER BY average_score DESC;
        `;
        const result = await pool.query(analyticsQuery, [chatId]);
        res.json(result.rows);
    } catch (error) {
        console.error(`[GET /api/chats/:chatId/analytics] Error fetching analytics for chat ${chatId} by user ${email}:`, error);
        res.status(500).json({ message: 'Server error while fetching chat analytics.' });
    }
});

// This endpoint was not requested to be changed and is left as is.
// It is assumed that the ingestConversation service has been updated to handle the new schema.
router.post('/ingest', async (req, res) => {
    const { humeData } = req.body;
    const { email: userEmail } = req.user;

    if (!humeData) {
        return res.status(400).json({ message: 'humeData is required.' });
    }

    try {
        const result = await ingestConversation(humeData, userEmail);
        res.status(201).json({
            message: 'Conversation ingested successfully!',
            chatId: result.chatId,
        });
    } catch (error) {
        console.error(`[POST /api/chats/ingest] Error for user ${userEmail}:`, error.message);
        res.status(500).json({ message: 'An error occurred during conversation ingestion.' });
    }
});

module.exports = router;
