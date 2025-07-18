// server/api/index.js
const express = require('express');
const authRoutes = require('./auth');
const chatRoutes = require('./chats');

const router = express.Router();

// Mount the routers on their respective paths
router.use('/auth', authRoutes);
router.use('/chats', chatRoutes);

module.exports = router;