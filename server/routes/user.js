import express from 'express';
import { User } from '../models/User.js';
import { UserProfile } from '../models/UserProfile.js';

const router = express.Router();

router.get('/data', async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user data' });
  }
});

router.post('/profile', async (req, res) => {
  try {
    const { profileData } = req.body;
    
    if (!profileData || !Array.isArray(profileData)) {
      return res.status(400).json({ error: 'Valid profile data is required' });
    }
    
    const responses = profileData.map(item => ({
      question: item.question,
      answer: item.answer
    }));
    
    const existingProfile = await UserProfile.findOne({ userId: req.userId });
    
    if (existingProfile) 
    {
      existingProfile.responses = responses;
      existingProfile.updatedAt = Date.now();
      await existingProfile.save();
      res.json(existingProfile);
    } else {
      const newProfile = new UserProfile({
        userId: req.userId,
        responses: responses
      });
      await newProfile.save();
      res.status(201).json(newProfile);
    }
  } catch (error) {
    console.error('Error saving profile:', error);
    res.status(500).json({ error: 'Failed to save profile data' });
  }
});

router.get('/profile', async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ userId: req.userId });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching profile data' });
  }
});

export { router as userRouter };