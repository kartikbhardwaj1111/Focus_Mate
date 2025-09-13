const mongoose = require('mongoose');
require('dotenv').config();

const User = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },  
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    image: {
        type: String,
        default: `${process.env.DEFAULT_PROFILE_PIC}`,
    },
    totalFocusTime: { type: Number, default: 0 },
    completedSessions: { type: Number, default: 0 },
    tasksCompleted: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
});

module.exports = mongoose.model('User', User);