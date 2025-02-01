import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  moodLogs: [{
    mood: String,
    intensity: Number,
    note: String,
    timestamp: { type: Date, default: Date.now }
  }],
  journalEntries: [{
    title: String,
    content: String,
    tags: [String],
    timestamp: { type: Date, default: Date.now }
  }],
  aiInteractions: [{
    message: String,
    response: String,
    timestamp: { type: Date, default: Date.now }
  }]
});

export const User = mongoose.model('User', userSchema);