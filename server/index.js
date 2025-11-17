const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db.js');
const http = require('http');
const { Server } = require('socket.io');
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const commentRoutes = require('./routes/commentRoutes');

// Load config
dotenv.config();

// Connect to Database
connectDB();

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Your Frontend URL
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors()); // Allows frontend requests
app.use(express.json()); // Allows us to accept JSON data in the body
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/comments', commentRoutes);

// --- SOCKET.IO LOGIC ---
io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);

    // User joins a "Room" named after their own User ID
    // This allows others to send messages to this specific user
    socket.on('join_user_room', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined their private room`);
    });

    // 1. Join a Project Room
    socket.on('join_project', (projectId) => {
        socket.join(`project_${projectId}`);
        console.log(`User joined project room: ${projectId}`);
    });

    // 2. Leave a Project Room (Optional but good for performance)
    socket.on('leave_project', (projectId) => {
        socket.leave(`project_${projectId}`);
    });

    // 3. Handle Project Messages
    socket.on('send_comment', (data) => {
        // data = { project, user, text, senderName, avatar }
        // Broadcast to everyone in that specific project room
        io.to(`project_${data.project}`).emit('receive_comment', data);
    });

    // Handle sending a message
    socket.on('send_message', (data) => {
        // data = { senderId, receiverId, message }
        // Emit to the RECEIVER'S room
        io.to(data.receiverId).emit('receive_message', data);
    });

    socket.on('disconnect', () => {
        console.log('User Disconnected', socket.id);
    });
});

// Start Server
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});