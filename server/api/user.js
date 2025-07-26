// server/api/user.js
const express = require('express');
const pool = require('../database');
const { authenticateToken } = require('../middleware/authJWT');

const router = express.Router();

/**
 * Route: GET /api/user/me
 * Description: Fetches the authenticated user's details and their most recent profile ID.
 * Protection: This route is now protected by the imported authenticateToken middleware.
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
        const userResult = await dbClient.query('SELECT id, email FROM users WHERE id = $1', [userId]);
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

        // Commit the transaction
        await dbClient.query('COMMIT');

        // 3. Send the combined user and profile data in the response.
        res.status(200).json({
            id: user.id,
            email: user.email,
            profileId: profileId,
        });

    } catch (error) {
        // If any error occurs, roll back
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

module.exports = router;
