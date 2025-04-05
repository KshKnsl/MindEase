import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import morgan from 'morgan';
import { User } from './models/User.js';
import { router as authRoutes } from './routes/auth.js';
import { router as questionRoutes } from './routes/questions.js';
import {router as responseRoutes} from './routes/Response.js';
import { userRouter } from './routes/user.js';
import { router as ttsRoutes } from './routes/tts.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import plannerRouter from './models/Planner.js';

dotenv.config(); 

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev')); 

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mindease';
mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/tts', ttsRoutes);

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        console.log('Token:', token);
        if (!token) {
            return res.status(401).json({ error: 'No token provided. Please authenticate.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        if (!decoded || !decoded.id) {
            return res.status(401).json({ error: 'Invalid token. Please authenticate.' });
        }

        req.userId = decoded.id;
        next();
    } catch (error) {
        console.error('Token verification error:', error.message);
        res.status(401).json({ error: 'Invalid or expired token. Please authenticate.' });
    }
};

// Using the auth middleware for protected routes
app.use('/api/user', auth, userRouter);
app.use('/api/questions', auth, questionRoutes);
app.use('/api/response', (req, res, next) => {
    console.log('Response route hit');
    next();
}, responseRoutes);
app.use('/api/planner', plannerRouter);
app.get('/api/user/data', auth, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching user data' });
    }
});

// Enhanced Gemini AI implementation for MindEase
const apikey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apikey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Define the system prompt content for MindEase AI assistant
const MINDEASE_ROLE_CONTENT = 
`You are MindEase, an AI brain offloader and emotional assistant that helps users manage their thoughts and emotions. 
Help organize thoughts and ideas, detect emotional states, provide insights, offer stress-relief suggestions, 
and act as a supportive emotional companion. Respond with empathy and clarity. Since you are a voice assistant, you should take care of the answer's length and tone and choice of words`;

app.post('/api/genai/ask', async (req, res) => {
    try {
        console.log('Received request to /api/genai/ask', req.body);
        const { prompt, conversationHistory = [], saveQuestion = false } = req.body;
        console.log('Prompt:', prompt);
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required.' });
        }

        let userContext = "";
        if (req.userId) {
            try {
                const { UserProfile } = await import('./models/UserProfile.js');
                const profile = await UserProfile.findOne({ userId: req.userId });
                
                if (profile && profile.responses.length > 0) {
                    userContext = "User Profile Information:\n" + 
                        profile.responses.map(r => `Q: ${r.question}\nA: ${r.answer}`).join('\n\n') + 
                        "\n\nPlease use this information about the user to personalize your responses.";
                }
            } catch (error) {
                console.error('Error fetching user profile:', error.message);
            }
        }
        
        // Combine the MindEase role with user context
        const contextWithProfile = userContext 
            ? `${MINDEASE_ROLE_CONTENT}\n\n${userContext}` 
            : MINDEASE_ROLE_CONTENT;
        
        const result = await model.generateContent({
            contents: [
                {
                    role: "user",
                    parts: [
                        { text: contextWithProfile },
                        { text: prompt }
                    ]
                }
            ]
        });
        
        const text = result.response.text();
        
        const responseData = {
            response: text
        };

        // Save the question and response if requested and user is authenticated
        if (saveQuestion && req.userId) {
            try {
                const { Question } = await import('./models/Question.js');
                const newQuestion = new Question({
                    userId: req.userId,
                    content: prompt,
                    aiResponse: text
                });
                await newQuestion.save();
                responseData.questionId = newQuestion._id;
            } catch (error) {
                console.error('Error saving question:', error.message);
            }
        }
        
        res.json(responseData);
    } catch (error) {
        console.error('Error interacting with Gemini:', error.message);
        res.status(500).json({ error: 'Failed to process the request.' });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;
