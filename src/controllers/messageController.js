// /controllers/messageController.js
const Message = require('../models/messageModel');

// Send private message
const createMessage = async (req, res) => {
    try {
        const { sender, receiver, message } = req.body;

        // Ensure all fields are provided
        if (!sender || !receiver || !message) {
            return res.status(400).send('Sender, receiver, and message are required.');
        }

        // Create a new message record
        const newMessage = await Message.create({ sender, receiver, message });

        // Respond with the newly created message
        res.status(201).json(newMessage);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating message');
    }
};

const sendPrivateMessage = async (req, res) => {
    const { sender, receiver, message } = req.body;
    try {
        const newMessage = await Message.create({ sender, receiver, message });
        res.status(200).json(newMessage);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Send message to room
const sendRoomMessage = async (req, res) => {
    const { sender, room, message } = req.body;
    try {
        const newMessage = await Message.create({ sender, room, message });
        res.status(200).json(newMessage);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all messages in a room
const getRoomMessages = async (req, res) => {
    const { room } = req.params;
    try {
        const messages = await Message.find({ room }).populate('sender');
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all private messages between two users
const getPrivateMessages = async (req, res) => {
    const { sender, receiver } = req.params;
    try {
        const messages = await Message.find({
            $or: [
                { sender, receiver },
                { sender: receiver, receiver: sender }
            ]
        }).populate('sender receiver');
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createMessage, sendPrivateMessage, sendRoomMessage, getRoomMessages, getPrivateMessages };
