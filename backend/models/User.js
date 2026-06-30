// ==========================================
// 👤 MONGODB USER SCHEMA WITH AUTO-HASHING - MODELS/USER.JS
// ==========================================

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Security package to encrypt passwords

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Username is strictly required"],
            unique: true,
            trim: true,
            minlength: [3, "Username must be at least 3 characters long"]
        },
        email: {
            type: String,
            required: [true, "Email address is strictly required"],
            unique: true,
            trim: true,
            lowercase: true
        },
        password: {
            type: String,
            required: [true, "Password is strictly required"],
            minlength: [6, "Password must be at least 6 characters long"]
        }
    },
    {
        timestamps: true
    }
);

// SECURITY HOOK: Automatically hash the password before saving into the database
userSchema.pre('save', async function (next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return next();

    try {
        // Generate a secure cryptographic salt (10 rounds is standard industry standard)
        const salt = await bcrypt.genSalt(10);
        // Overwrite the plain text password with the securely hashed string
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// SECURITY METHOD: Compare incoming login password with the securely hashed database password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);