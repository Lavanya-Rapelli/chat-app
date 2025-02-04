const Room = require('../models/roomModel');

// Create a room
const createRoom = async (req, res) => {
    const { name, participants } = req.body;

    // Validate input fields
    if (!name || !participants || participants.length === 0) {
        return res.status(400).send('Room name and participants are required.');
    }

    try {
        // Check if room with the same name already exists
        const existingRoom = await Room.findOne({ name });
        if (existingRoom) {
            return res.status(400).send('Room with this name already exists.');
        }

        // Create a new room
        const room = new Room({ name, participants });
        await room.save();

        // Respond with the created room
        res.status(201).json(room);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all rooms
const getAllRooms = async (req, res) => {
    try {
        // Fetch all rooms from the database
        const rooms = await Room.find();
        res.status(200).json(rooms);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createRoom, getAllRooms };
