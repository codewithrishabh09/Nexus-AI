// ==========================================
// 🛣️ SECURE CHAT ROUTER - ROUTES/CHATROUTES.JS
// ==========================================

const express = require('express');
const router = express.Router();
const { getChatHistory } = require('../controllers/chatController');
const protect = require('../middleware/authMiddleware'); // 👈 Seamless clean import

// GET /api/chat/history - Strictly protected route mapping
router.get('/history', protect, getChatHistory);

module.exports = router;