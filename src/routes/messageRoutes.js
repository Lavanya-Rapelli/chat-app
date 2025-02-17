// /src/routes/messageRoutes.js
const express = require('express');
const { createMessage, sendPrivateMessage, sendRoomMessage, getRoomMessages, getPrivateMessages } = require('../controllers/messageController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/message', createMessage); 
router.post('/private', verifyToken, sendPrivateMessage);
router.post('/room', verifyToken, sendRoomMessage);
router.get('/room/:room', verifyToken, getRoomMessages);
router.get('/private/:sender/:receiver', verifyToken, getPrivateMessages);


module.exports = router;
