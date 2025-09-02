const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },

  members: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      role: { type: String, enum: ["owner", "admin", "member"], default: "member" },
      joinedAt: { type: Date, default: Date.now }
    }
  ],

  // Track team productivity
  totalFocusTime: { type: Number, default: 0 },
  tasksCompleted: { type: Number, default: 0 },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Team', TeamSchema);
