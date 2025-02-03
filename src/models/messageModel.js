// /models/messageModel.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // For private chat (optional)
    room: { type: String }, // For group chat (optional)
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    edited: { type: Boolean, default: false }, // Track if message is edited
    deleted: { type: Boolean, default: false }, // Track if message is deleted
});

module.exports = mongoose.model('Message', messageSchema);
