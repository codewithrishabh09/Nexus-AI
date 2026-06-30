// ==========================================
// 🛡️ SECURE CHAT CONTROLLER - 
// ==========================================

const Message = require('../models/Message');

/**
 * @desc    Fetch historical chat messages securely
 * @route   GET /api/chat/history
 * @access  Private (Requires Valid JWT Token)
 */
exports.getChatHistory = async (req, res) => {
    try {
        // Fetch last 100 messages from database to optimize network payload
        const logs = await Message.find()
            .sort({ createdAt: 1 })
            .limit(100);

        res.status(200).json({
            success: true,
            count: logs.length,
            history: logs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to securely retrieve chat records",
            error: error.message
        });
    }
};