// /controllers/roomController.js
const Room = require('../models/roomModel');

// Create a room
const createRoom = async (req, res) => {
    const { name, participants } = req.body;
    try {
        const room = new Room({ name, participants });
        await room.save();
        res.status(201).json(room);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all rooms
const getAllRooms = async (req, res) => {
    try {
        const rooms = await Room.find();
        res.status(200).json(rooms);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createRoom, getAllRooms };
