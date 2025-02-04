const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, // Ensure room name is unique
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Participants are referenced users
    createdAt: { type: Date, default: Date.now }, // Automatically set the creation date
});

module.exports = mongoose.model('Room', roomSchema);
