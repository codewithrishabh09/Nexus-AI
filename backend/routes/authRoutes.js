// ==========================================
// 🛣️ AUTHENTICATION ROUTES
// ==========================================

const express = require('express');
const router = express.Router();
const { registerUser, loginUser, changePassword, getMe, logoutUser } = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/change-password', protect, changePassword);  // 🔒 Protected
router.get('/me', protect, getMe);                         // 🔒 Protected
router.post('/logout', logoutUser);

module.exports = router;