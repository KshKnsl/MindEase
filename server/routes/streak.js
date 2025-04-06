import express from 'express';
import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { UserStreak } from '../models/UserStreak.js';
import Response from '../models/Response.js'; // Fixed: import default export
import jwt from 'jsonwebtoken';

const router = express.Router();

// Helper function to check and update user's streak
const updateStreak = async (userId) => {
  try {
    // Find or create user streak document
    let userStreak = await UserStreak.findOne({ userId });
    
    if (!userStreak) {
      userStreak = new UserStreak({
        userId,
        currentStreak: 1,
        longestStreak: 1,
        lastActive: new Date(),
        streakHistory: [{
          date: new Date(),
          active: true
        }]
      });
      await userStreak.save();
      return userStreak;
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const lastActive = new Date(userStreak.lastActive);
    lastActive.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Check if user was already active today
    if (lastActive.getTime() === today.getTime()) {
      // Already logged in today, just add to history if not present
      const todayStr = today.toISOString().split('T')[0];
      const historyToday = userStreak.streakHistory.find(
        h => new Date(h.date).toISOString().split('T')[0] === todayStr
      );
      
      if (!historyToday) {
        userStreak.streakHistory.push({
          date: today,
          active: true
        });
        await userStreak.save();
      }
      return userStreak;
    }
    
    // Check if last active was yesterday
    if (lastActive.getTime() === yesterday.getTime()) {
      // Continue streak
      userStreak.currentStreak += 1;
      userStreak.lastActive = today;
      
      // Update longest streak if current is longer
      if (userStreak.currentStreak > userStreak.longestStreak) {
        userStreak.longestStreak = userStreak.currentStreak;
      }
    } else {
      // Streak broken, reset to 1
      userStreak.currentStreak = 1;
      userStreak.lastActive = today;
    }
    
    // Add today to history
    userStreak.streakHistory.push({
      date: today,
      active: true
    });
    
    // Keep only last 60 days in history
    if (userStreak.streakHistory.length > 60) {
      userStreak.streakHistory = userStreak.streakHistory.slice(-60);
    }
    
    await userStreak.save();
    return userStreak;
  } catch (error) {
    console.error('Error updating streak:', error);
    throw error;
  }
};

// Middleware to validate JWT token
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    if (!decoded || !decoded.id) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.userId = decoded.id;
    next();
  } catch (error) {
    console.error('Token verification error:', error.message);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Get user streak data
router.get('/', auth, async (req, res) => {
  try {
    const userStreak = await updateStreak(req.userId);
    res.json(userStreak);
  } catch (error) {
    console.error('Error retrieving streak:', error);
    res.status(500).json({ error: 'Failed to retrieve streak data' });
  }
});

// Get user usage statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const totalInteractions = await Response.countDocuments({ userId: req.userId });
    
    // Get mood entries count (assuming they're tagged in responses)
    const moodEntries = await Response.countDocuments({ 
      userId: req.userId,
      moodTag: { $exists: true }
    });
    
    // Count scheduled events (simplified version, you might want to adjust based on your data structure)
    const eventsScheduled = 0; // Placeholder for actual implementation
    
    res.json({
      totalInteractions,
      moodEntries,
      eventsScheduled
    });
  } catch (error) {
    console.error('Error retrieving usage stats:', error);
    res.status(500).json({ error: 'Failed to retrieve usage statistics' });
  }
});

export default router;
