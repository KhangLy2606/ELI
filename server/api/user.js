// server/api/user.js
const express = require('express');
const pool = require('../database');
const { authenticateToken } = require('../middleware/authJWT');

const router = express.Router();

/**
 * Route: GET /api/user/me
 * Description: Fetches the authenticated user's details and their single most recent profile ID.
 * Protection: This route is protected by the authenticateToken middleware.
 */
router.get('/me', authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    if (!userId) {
        return res.status(400).json({ message: "User ID not found in token payload." });
    }

    let dbClient;
    try {
        dbClient = await pool.connect();
        await dbClient.query('BEGIN');

        // 1. Fetch basic user details
        const userResult = await dbClient.query('SELECT id, email, full_name FROM users WHERE id = $1', [userId]);
        if (userResult.rows.length === 0) {
            await dbClient.query('ROLLBACK');
            return res.status(404).json({ message: "User not found in database." });
        }
        const user = userResult.rows[0];

        // 2. Fetch the ID of the user's most recently created profile.
        const profileResult = await dbClient.query(
            'SELECT id FROM profiles WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
            [userId]
        );

        if (profileResult.rows.length === 0) {
            await dbClient.query('ROLLBACK');
            return res.status(404).json({ message: "No profile found for this user." });
        }
        const profileId = profileResult.rows[0].id;

        await dbClient.query('COMMIT');

        // 3. Send the original flat response structure.
        res.status(200).json({
            id: user.id,
            email: user.email,
            full_name: user.full_name,
            profileId: profileId,
        });

    } catch (error) {
        if (dbClient) {
            await dbClient.query('ROLLBACK');
        }
        console.error("Error fetching /api/user/me:", error);
        res.status(500).json({ message: "Internal server error while fetching user data." });
    } finally {
        if (dbClient) {
            dbClient.release();
        }
    }
});


/**
 * Route: GET /api/user/session-data (New Implementation)
 * Description: Fetches the authenticated user's details AND all their associated profiles for the new AuthContext.
 * Protection: This route is protected by the authenticateToken middleware.
 */
router.get('/session-data', authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    if (!userId) {
        return res.status(400).json({ message: "User ID not found in token payload." });
    }

    let dbClient;
    try {
        dbClient = await pool.connect();

        // 1. Fetch user details
        const userResult = await dbClient.query('SELECT id, email, full_name FROM users WHERE id = $1', [userId]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: "User not found in database." });
        }
        const user = userResult.rows[0];

        // 2. Fetch ALL profiles for this user
        const profilesResult = await dbClient.query(
            'SELECT id, user_id, preferred_name FROM profiles WHERE user_id = $1 ORDER BY created_at ASC',
            [userId]
        );
        const profiles = profilesResult.rows;

        // 3. Send the combined, nested data in the response
        res.status(200).json({
            user: user,
            profiles: profiles,
        });

    } catch (error) {
        console.error("Error fetching /api/user/session-data:", error);
        res.status(500).json({ message: "Internal server error while fetching session data." });
    } finally {
        if (dbClient) {
            dbClient.release();
        }
    }
});

module.exports = router;
