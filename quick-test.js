const mongoose = require("mongoose");

const uri = "mongodb+srv://ai-chatbot:wyWKG%238xX7fAJ8j@aichatbot.oypxslo.mongodb.net/aichatbot?retryWrites=true&w=majority";

console.log("🔗 Testing connection to:", uri);

mongoose.connect(uri, {
connectTimeoutMS: 5000,
socketTimeoutMS: 5000,
})
.then(() => {
console.log("✅ SUCCESS! MongoDB Connected!");
process.exit(0);
})
.catch((err) => {
console.log("❌ FAILED:", err.message);
process.exit(1);
});
