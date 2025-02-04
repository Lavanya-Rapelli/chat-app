const express = require('express');
const { createRoom, getAllRooms } = require('../controllers/roomController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

// Protected route to create a room
router.post('/create', verifyToken, createRoom);

// Protected route to get all rooms
router.get('/', verifyToken, getAllRooms);

module.exports = router;
