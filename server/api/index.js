// server/api/index.js
const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');
const chatRoutes = require('./chats');
const userRoutes = require('./user');


router.use('/user', userRoutes);
router.use('/auth', authRoutes);
router.use('/chats', chatRoutes);

module.exports = router;