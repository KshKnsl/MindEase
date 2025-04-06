import express from 'express';
import { User } from '../models/User.js';
import { UserProfile } from '../models/UserProfile.js';
import jwt from 'jsonwebtoken';

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
    const token = req.headers.authorization?.split(' ')[1];
    console.log('Token:', token);
    console.log('Received profile data:', profileData);
    if (!profileData || !Array.isArray(profileData)) {
      return res.status(400).json({ error: 'Valid profile data is required' });
    }
    
    const responses = profileData.map(item => ({
      question: item.question,
      answer: item.answer
    }));
    
   
    const formattedQA = profileData
  .map((item, i) => `Q${i + 1}: ${item.question}\nA${i + 1}: ${item.answer}`)
  .join("\n");

       const summaryPrompt = `
       You are an empathetic AI assistant helping to understand users emotionally.
       
       Below are 15 questions and answers from a user:
       
       ${formattedQA}

       Based on this, write a friendly, insightful emotional summary of the user. Include:
       - Their emotional personality (e.g., calm, anxious, motivated)
       - Likely stress triggers or patterns
       - Coping styles and behavior
       - Helpful suggestions for support

       Be kind, warm, and non-judgmental.
       `;
       
       const response = await fetch('http://localhost:5000/api/genai/ask', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            prompt: summaryPrompt,
        })
    });
    const responseData = await response.json();

    console.log("Summary Response:", responseData.response);
     if (!token) {
            return res.status(401).json({ error: 'No token provided. Please authenticate.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        if (!decoded || !decoded.id) {
            return res.status(401).json({ error: 'Invalid token. Please authenticate.' });
        }

        const userId = decoded?.id;
        if (!userId) {
            return res.status(400).json({ error: 'User ID not found in token' });
        }
        console.log("Decoded userId:", userId);

        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }

        user.summary = responseData.response; // Assuming responseData contains a 'summary' field
        await user.save();

        console.log("User summary saved:", user.summary);
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