const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // Added for password hashing

// ------------------------------
// Counter Schema (for user_id auto-increment)
// ------------------------------
const counterSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    seq: { type: Number, default: 0 }
});
const Counter = mongoose.model('Counter', counterSchema);

// ------------------------------
// UserInfo Schema
// ------------------------------
const userInfoSchema = new mongoose.Schema({
    user_id: { type: String, unique: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    designation: { type: String, required: true },
    age_group: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
});

// Auto-generate user_id like "U001" and hash password
userInfoSchema.pre('save', async function (next) {
    try {
        if (this.isNew) {
            const counter = await Counter.findOneAndUpdate(
                { name: 'user_id' },
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );
            const padded = String(counter.seq).padStart(3, '0');
            this.user_id = `U${padded}`;
        }

        // Hash password before saving
        if (this.isModified('password')) {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        }

        next();
    } catch (err) {
        next(err);
    }
});

const UserInfo = mongoose.model('UserInfo', userInfoSchema);

// ------------------------------
// Chatbot Schema
// ------------------------------
const chatbotSchema = new mongoose.Schema({
    user_id: {
        type: String,
        ref: 'UserInfo',
        required: true
    },
    chatbot_name: {
        type: String,
        required: true
    },
    input_type: {
        type: String,
        enum: ['pdf', 'website'],
        required: true
    },
    pdf_file: {
        filename: { type: String },
        data: { type: Buffer },
        content_type: { type: String }
    },
    website_url: {
        type: String
    },
    chunks: [
        {
            text: { type: String },
            embedding: {
                type: [Number],
                validate: {
                    validator: v => Array.isArray(v) && v.length === 768,
                    message: 'Embedding must be a 768-dimensional vector.'
                }
            }
        }
    ],
    faiss_index: {
        index_faiss: Buffer,
        index_pkl: Buffer
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

// Ensure chatbot name is unique per user
chatbotSchema.index({ user_id: 1, chatbot_name: 1 }, { unique: true });

const Chatbot = mongoose.model('Chatbot', chatbotSchema);

// ------------------------------
// ChatHistory Schema
// ------------------------------
const chatHistorySchema = new mongoose.Schema({
    user_id: { type: String, ref: 'UserInfo', required: true },
    bot_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Chatbot', required: true },
    messages: [
        {
            role: { type: String, enum: ['user', 'bot'], required: true },
            content: { type: String, required: true }
        }
    ],
    timestamp: { type: Date, default: Date.now }
});

const ChatHistory = mongoose.model('ChatHistory', chatHistorySchema);

// ------------------------------
// Export All Models
// ------------------------------
module.exports = {
    UserInfo,
    Chatbot,
    ChatHistory,
    Counter
};




