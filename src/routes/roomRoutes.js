// /routes/roomRoutes.js
const express = require('express');
const { createRoom, getAllRooms } = require('../controllers/roomController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/create', verifyToken, createRoom);
router.get('/', verifyToken, getAllRooms);

module.exports = router; // corrected
