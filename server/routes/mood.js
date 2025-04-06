import express from 'express';
import { Mood } from '../models/Mood.js';

const router = express.Router();

// Get user's mood history
router.get('/:userId', async (req, res) => {
    try {
        const moods = await Mood.find({ userId: req.params.userId })
            .sort({ date: -1 })
            .limit(10);
        res.json(moods);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user's current mood
router.get('/current/:userId', async (req, res) => {
    try {
        const currentMood = await Mood.findOne({ userId: req.params.userId })
            .sort({ date: -1 });
        res.json(currentMood || { analyzedMood: 'neutral' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new mood entry
router.post('/', async (req, res) => {
    try {
        const newMood = new Mood({
            userId: req.body.userId,
            rawPrompts: req.body.prompts || []
        });
        await newMood.save();
        res.status(201).json(newMood);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
