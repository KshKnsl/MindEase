import mongoose from 'mongoose';

const userStreakSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  currentStreak: {
    type: Number,
    default: 0
  },
  longestStreak: {
    type: Number,
    default: 0
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  streakHistory: [{
    date: {
      type: Date,
      required: true
    },
    active: {
      type: Boolean,
      default: true
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

userStreakSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export const UserStreak = mongoose.model('UserStreak', userStreakSchema);
