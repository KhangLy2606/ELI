// ELI/server/api.js
// Defines all the API routes for the application.

const express = require('express');
const bcrypt = require('bcrypt');
const jwt =require('jsonwebtoken');
const pool = require('./database'); // Import the database pool
const { jwtSecret } = require('./config'); // Import the JWT secret from config

const router = express.Router();

router.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await pool.query(
            'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
            [email, hashedPassword]
        );
        res.status(201).json({
            message: 'User created successfully!',
            user: newUser.rows[0],
        });
    } catch (error) {
        console.error('Signup Error:', error);
        if (error.code === '23505') {
            return res.status(409).json({ message: 'An account with this email already exists.' });
        }
        res.status(500).json({ message: 'An error occurred on the server.' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }
    try {
        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = userResult.rows[0];
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
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
            user: { id: user.id, email: user.email },
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'An error occurred on the server.' });
    }
});

// Export the router to be used in the main server.js file
module.exports = router;
