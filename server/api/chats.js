// server/api/chats.js
const express = require('express');
const pool = require('../database');
const { authenticateToken } = require('../middleware/auth');
const { ingestConversation } = require('../services/conversationService');

const router = express.Router();

// This middleware protects all routes in this file
router.use(authenticateToken);

// Get all chats for the authenticated user
router.get('/', async (req, res) => {
    const { userId, email } = req.user;
    try {
        const result = await pool.query(
            'SELECT id, start_timestamp, event_count FROM chats WHERE user_id = $1 ORDER BY start_timestamp DESC',
            [userId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error(`[GET /api/chats] Error fetching chat history for user ${email}:`, error);
        res.status(500).json({ message: 'Server error while fetching chats.' });
    }
});

// Get all events for a specific chat
router.get('/:chatId', async (req, res) => {
    const { chatId } = req.params;
    const { userId, email } = req.user;
    try {
        // Optional: Ensure the user owns this chat before fetching events
        const chatCheck = await pool.query('SELECT user_id FROM chats WHERE id = $1', [chatId]);
        if (chatCheck.rows.length === 0 || chatCheck.rows[0].user_id !== userId) {
            console.warn(`[GET /api/chats/:chatId] User ${email} attempted to access unowned chat ${chatId}`);
            return res.status(404).json({ message: 'Chat not found or access denied.' });
        }

        const result = await pool.query(
            'SELECT role, type, message_text, emotion_features, timestamp FROM chat_events WHERE chat_id = $1 ORDER BY timestamp ASC',
            [chatId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error(`[GET /api/chats/:chatId] Error fetching details for chat ${chatId} by user ${email}:`, error);
        res.status(500).json({ message: 'Server error while fetching chat details.' });
    }
});

// Get analytics for a single chat
router.get('/:chatId/analytics', async (req, res) => {
    const { chatId } = req.params;
    const { userId, email } = req.user;
    try {
        const analyticsQuery = `
            SELECT key AS emotion, AVG((value::numeric)) AS average_score
            FROM chat_events, jsonb_each_text(emotion_features)
            WHERE chat_id = $1 AND type = 'USER_MESSAGE'
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

// Ingest a conversation from Hume AI
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