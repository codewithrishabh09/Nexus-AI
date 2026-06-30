// ==========================================
// 💬 MONGODB MESSAGE SCHEMA - MODELS/MESSAGE.JS
// ==========================================

const mongoose = require('mongoose');

// Define the blueprint for tracking chat logs and conversations
const messageSchema = new mongoose.Schema(
    {
        chatId: {
            type: String,
            required: [true, "Chat identification is required"],
            default: "chat-1"
        },
        sender: {
            type: String,
            required: [true, "Sender identification name/ID is required"],
            trim: true
        },
        text: {
            type: String,
            required: [true, "Message body text content cannot be empty"],
            trim: true
        },
        role: {
            type: String,
            enum: ['user', 'model'], // Standardized roles for conversational AI integration
            default: 'user'
        }
    },
    {
        // Automatically stamps exact creation date and time for chat history ordering
        timestamps: true
    }
);

// Export the compiled model to interact with the 'messages' collection in MongoDB
module.exports = mongoose.model('Message', messageSchema);