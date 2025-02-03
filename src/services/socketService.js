// /services/socketService.js
const jwt = require('jsonwebtoken');
const Message = require('../models/messageModel');
// const Room = require('../models/roomModel');
// const User = require('../models/UserModel');

let onlineUsers = {}; // Store online users

const socketService = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected', socket.id);

        // Authenticate user
        socket.on('authenticate', (token) => {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                onlineUsers[decoded.id] = socket.id;
                console.log(`${decoded.username} authenticated and online`);
            } catch (error) {
                console.error('Authentication failed', error);
            }
        });

        // Private message
        socket.on('privateMessage', async (data) => {
            const { sender, receiver, message } = data;
            const newMessage = await Message.create({ sender, receiver, message });
            
            // Find receiver's socket
            const receiverSocket = onlineUsers[receiver];
            if (receiverSocket) {
                io.to(receiverSocket).emit('privateMessage', newMessage);
            }
        });

        // Send message to room (group chat)
        socket.on('joinRoom', (roomId) => {
            socket.join(roomId);
            console.log(`User joined room ${roomId}`);
        });

        socket.on('roomMessage', async (data) => {
            const { sender, room, message } = data;
            const newMessage = await Message.create({ sender, room, message });
            
            // Broadcast message to all participants in room
            io.to(room).emit('roomMessage', newMessage);
        });

        // Disconnection
        socket.on('disconnect', () => {
            Object.keys(onlineUsers).forEach(userId => {
                if (onlineUsers[userId] === socket.id) {
                    delete onlineUsers[userId];
                    console.log(`User ${userId} disconnected`);
                }
            });
        });
    });
};

module.exports = socketService;
