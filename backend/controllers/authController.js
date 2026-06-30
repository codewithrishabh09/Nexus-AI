// ==========================================
// 🛡️ AUTHENTICATION CONTROLLER
// ==========================================

const User = require('../models/User');
const jwt = require('jsonwebtoken');

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
};

/**
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: "User with this email already exists" });
        }

        const newUser = await User.create({ username, email, password });
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.cookie('nexus_token', token, cookieOptions);

        res.status(201).json({
            success: true,
            message: "User registered securely!",
            user: { id: newUser._id, username: newUser.username, email: newUser.email }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Registration failed", error: error.message });
    }
};

/**
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid credentials provided" });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials provided" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.cookie('nexus_token', token, cookieOptions);

        res.status(200).json({
            success: true,
            message: "Login verified successfully!",
            user: { id: user._id, username: user.username, email: user.email }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Login execution failed", error: error.message });
    }
};

/**
 * @route   POST /api/auth/change-password
 * @access  Private (JWT required)
 */
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, message: "Please provide both current and new password" });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ success: false, message: "New password must be at least 6 characters" });
        }

        // Get user with password field
        const user = await User.findById(req.user._id).select('+password');
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Verify current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Current password is incorrect" });
        }

        // Update password (pre-save hook will hash it)
        user.password = newPassword;
        await user.save();

        res.status(200).json({ success: true, message: "Password changed successfully!" });

    } catch (error) {
        res.status(500).json({ success: false, message: "Password change failed", error: error.message });
    }
};

/**
 * @route   GET /api/auth/me
 * @access  Private (JWT required)
 */
exports.getMe = async (req, res) => {
    res.status(200).json({
        success: true,
        user: { id: req.user._id, username: req.user.username, email: req.user.email }
    });
};

/**
 * @route   POST /api/auth/logout
 * @access  Public
 */
exports.logoutUser = (req, res) => {
    res.cookie('nexus_token', '', { httpOnly: true, expires: new Date(0) });
    res.status(200).json({ success: true, message: "Logged out successfully" });
};