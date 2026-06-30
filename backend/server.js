const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const { Server } = require('socket.io');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const Message = require('./models/Message');

const app = express();

app.set('trust proxy', 1);

// 🛡️ HTTP Headers Security
app.use(helmet());

// 🛡️ General API Rate Limit
const networkLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { success: false, message: "Too many requests, please try again after 15 minutes." }
});
app.use('/api/', networkLimiter);

// 🛡️ Strict Auth Rate Limit — brute force protection
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { success: false, message: "Too many auth attempts, please try again after 15 minutes." }
});
app.use('/api/auth/', authLimiter);

// 🛡️ CORS — only allow frontend
const corsOptions = {
    origin: process.env.FRONTEND_URL
        ? process.env.FRONTEND_URL.split(',')
        : ['http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '10kb' })); // Prevent large payload attacks
app.use(cookieParser());

// 🛡️ MongoDB Injection Prevention
app.use(mongoSanitize());

const server = http.createServer(app);

// 🔌 Socket.io
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL
            ? process.env.FRONTEND_URL.split(',')
            : ['http://localhost:5173', 'http://localhost:3000'],
        methods: ['GET', 'POST'],
        credentials: true
    }
});

// 🤖 Gemini AI
const aiProvider = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 🛣️ Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.get('/', (req, res) => {
    res.json({ success: true, message: "Nexus AI Backend running!", version: "4.0.0" });
});

// 🗄️ MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Atlas Connected!"))
    .catch((err) => console.error("❌ MongoDB Failed:", err.message));

// 🛡️ Socket rate limiting — prevent infinite spam/loops
const socketMessageCount = new Map();
const SOCKET_MSG_LIMIT = 20;    // 20 messages
const SOCKET_WINDOW_MS = 60000; // per minute

io.use((socket, next) => {
    try {
        const cookieHeader = socket.handshake.headers.cookie;
        if (!cookieHeader) return next(new Error('Authentication error: No cookies'));

        const cookies = {};
        cookieHeader.split(';').forEach(cookie => {
            const parts = cookie.split('=');
            cookies[parts.shift().trim()] = decodeURI(parts.join('='));
        });

        const token = cookies.nexus_token;
        if (!token) return next(new Error('Authentication error: Token missing'));

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) return next(new Error('Authentication error: Invalid token'));
            socket.user = decoded;
            next();
        });
    } catch (error) {
        next(new Error('Authentication error'));
    }
});

io.on('connection', (socket) => {
    console.log(`👤 Connected: ${socket.id}`);
    socketMessageCount.set(socket.id, { count: 0, resetAt: Date.now() + SOCKET_WINDOW_MS });

    socket.on('sendMessage', async (data) => {
        try {
            // 🛡️ Socket spam protection
            const tracker = socketMessageCount.get(socket.id);
            if (tracker) {
                if (Date.now() > tracker.resetAt) {
                    socketMessageCount.set(socket.id, { count: 1, resetAt: Date.now() + SOCKET_WINDOW_MS });
                } else if (tracker.count >= SOCKET_MSG_LIMIT) {
                    socket.emit('receiveMessage', {
                        sender: 'Nexus_AI',
                        text: '⚠️ Too many messages. Please wait a moment.',
                        role: 'model',
                        timestamp: new Date()
                    });
                    return;
                } else {
                    tracker.count++;
                }
            }

            // 🛡️ Input validation + sanitize
            if (!data.text || typeof data.text !== 'string') return;
            const sanitizedText = data.text.trim().substring(0, 2000);
            if (!sanitizedText) return;

            const chatId = data.chatId || 'chat-1';
            const temperature = parseFloat(data.temperature) || 0.7;
            const persona = data.persona || 'Architect';

            // Save user message
            await Message.create({ sender: data.sender || 'Anonymous', text: sanitizedText, role: 'user', chatId });

            // Gemini AI
            const aiModel = aiProvider.getGenerativeModel({
                model: 'gemini-1.5-flash',
                generationConfig: { temperature: temperature },
                systemInstruction: { parts: [{ text: `You are a ${persona} persona. Respond in a style that fits this persona perfectly.` }] }
            });
            const aiResult = await aiModel.generateContent(sanitizedText);
            const aiReply = aiResult.response.text();

            const aiMessage = await Message.create({ sender: 'Nexus_AI', text: aiReply, role: 'model', chatId });

            socket.emit('receiveMessage', {
                id: aiMessage._id,
                sender: 'Nexus_AI',
                text: aiReply,
                role: 'model',
                timestamp: aiMessage.createdAt,
                chatId: chatId
            });

        } catch (error) {
            console.error("❌ Error:", error.message);
            socket.emit('receiveMessage', {
                sender: 'Nexus_AI',
                text: "I encountered an issue. Please try again.",
                role: 'model',
                timestamp: new Date()
            });
        }
    });

    socket.on('disconnect', () => {
        socketMessageCount.delete(socket.id);
        console.log(`❌ Disconnected: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`\n🚀 Nexus AI running on port ${PORT}\n`);
});
