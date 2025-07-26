// server/api/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../database');
const { jwtSecret } = require('../config');

const router = express.Router();

router.post('/signup', async (req, res) => {
    const {
        email,
        password,
        fullName,
        reportFrequency,
        notificationPreferences,
        preferredName,
        relationship,
        dateOfBirth,
        primaryLanguage,
        lifeStory,
        hobbies,
        importantPeople,
        companionName,
        voiceSelection,
        chattinessLevel,
        conversationTone,
        wakeUpTime,
        bedtime,
        cognitiveActivities,
        reminders,
    } = req.body;

    if (!email || !password || !fullName || !preferredName) {
        return res.status(400).json({ message: 'Missing required fields: email, password, full name, and preferred name are required.' });
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const hashedPassword = await bcrypt.hash(password, 10);
        const userInsertQuery = `
            INSERT INTO users (email, password_hash, full_name, report_frequency, notification_preferences)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, email, full_name;
        `;
        const userValues = [email, hashedPassword, fullName, reportFrequency, notificationPreferences];
        const newUserResult = await client.query(userInsertQuery, userValues);
        const newUser = newUserResult.rows[0];

        const profileInsertQuery = `
            INSERT INTO profiles (
                user_id, preferred_name, relationship_to_user, date_of_birth, primary_language,
                life_story, hobbies, important_people, companion_name, voice_selection,
                chattiness_level, conversation_tone, wake_up_time, bedtime,
                cognitive_activities, reminders
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16);
        `;
        // Handle potentially null values for non-required fields
        const profileValues = [
            newUser.id,
            preferredName,
            relationship,
            dateOfBirth || null,
            primaryLanguage,
            lifeStory,
            hobbies,
            importantPeople,
            companionName,
            voiceSelection,
            chattinessLevel,
            conversationTone,
            wakeUpTime || null,
            bedtime || null,
            cognitiveActivities,
            reminders,
        ];
        await client.query(profileInsertQuery, profileValues);

        await client.query('COMMIT');

        const token = jwt.sign(
            { userId: newUser.id, email: newUser.email },
            jwtSecret,
            { expiresIn: '1h' }
        );

        res.status(201).json({
            message: 'User and profile created successfully!',
            token,
            user: newUser,
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error(`[POST /api/auth/signup] Transaction Error for ${email}:`, error);

        // Check for unique constraint violation (duplicate email)
        if (error.code === '23505' && error.constraint === 'users_email_key') {
            return res.status(409).json({ message: 'An account with this email already exists.' });
        }

        res.status(500).json({ message: 'An error occurred during the signup process.' });
    } finally {
        client.release();
    }
});

// User Login - This endpoint remains unchanged
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }
    try {
        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = userResult.rows[0];
        if (!user) {
            console.warn(`[POST /api/auth/login] Login attempt for non-existent user: ${email}`);
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            console.warn(`[POST /api/auth/login] Invalid password attempt for user: ${email}`);
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            jwtSecret,
            { expiresIn: '1h' }
        );
        res.json({
            message: 'Logged in successfully!',
            token,
            user: { id: user.id, email: user.email, full_name: user.full_name },
        });
    } catch (error) {
        console.error(`[POST /api/auth/login] Server error for ${email}:`, error);
        res.status(500).json({ message: 'An error occurred during login.' });
    }
});

module.exports = router;
