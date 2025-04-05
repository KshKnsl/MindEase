import express from 'express';
import { Question } from '../models/Question.js';

const router = express.Router();

// Middleware to check if user owns the question
const checkQuestionOwnership = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }
    
    if (question.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to access this question' });
    }
    
    req.question = question;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all questions for a user
router.get('/', async (req, res) => {
  try {
    const questions = await Question.find({ userId: req.userId })
      .sort({ createdAt: -1 });
    
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching questions' });
  }
});

// Get a specific question
router.get('/:id', checkQuestionOwnership, (req, res) => {
  res.json(req.question);
});

// Create a new question (this will also store the AI response)
router.post('/', async (req, res) => {
  try {
    const { content, aiResponse, tags } = req.body;
    
    if (!content || !aiResponse) {
      return res.status(400).json({ error: 'Question content and AI response are required' });
    }
    
    const newQuestion = new Question({
      userId: req.userId,
      content,
      aiResponse,
      tags: tags || []
    });
    
    const savedQuestion = await newQuestion.save();
    res.status(201).json(savedQuestion);
  } catch (error) {
    res.status(500).json({ error: 'Error creating question' });
  }
});

// Update a question
router.patch('/:id', checkQuestionOwnership, async (req, res) => {
  try {
    const { content, aiResponse, tags } = req.body;
    const updatedData = {};
    
    if (content) updatedData.content = content;
    if (aiResponse) updatedData.aiResponse = aiResponse;
    if (tags) updatedData.tags = tags;
    
    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );
    
    res.json(updatedQuestion);
  } catch (error) {
    res.status(500).json({ error: 'Error updating question' });
  }
});

// Delete a question
router.delete('/:id', checkQuestionOwnership, async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting question' });
  }
});

export { router };
