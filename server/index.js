import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import morgan from 'morgan';
import { User } from './models/User.js';
import { router as authRoutes } from './routes/auth.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

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

app.get('/api/user/data', auth, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching user data' });
    }
});

// Simplified Gemini API implementation
const apikey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apikey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

app.post('/api/genai/ask', async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required.' });
        }

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        
        res.json({ response: text });
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
