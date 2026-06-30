// ==========================================
// 🛡️ JWT AUTHORIZATION MIDDLEWARE - MIDDLEWARE/AUTHMIDDLEWARE.JS
// ==========================================

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * @desc    Middleware to protect routes and verify JSON Web Tokens (JWT)
 */
const protect = async (req, res, next) => {
    let token = req.cookies.nexus_token;

    // Fallback to HTTP Authorization header if no cookie
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
        try {

            // Verify the cryptographic integrity of the token using our secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Fetch the user data associated with the token from DB, excluding the hashed password
            req.user = await User.findById(decoded.id).select('-password');

            // Pass execution control to the next route controller handler
            return next();

        } catch (error) {
            console.error("❌ Token Verification Failed:", error.message);
            return res.status(401).json({
                success: false,
                message: "Not authorized, secure token verification failed!"
            });
        }
    }

    // If no token is provided in the headers at all
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Not authorized, no security token provided in request headers."
        });
    }
};

module.exports = protect; 