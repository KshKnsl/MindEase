import mongoose from 'mongoose';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const moodSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    analyzedMood: { type: String, enum: ['happy', 'neutral', 'sad'], required: true },
    rawPrompts: [{ type: String }],
    confidence: { type: Number },
    date: { type: Date, default: Date.now },
}, { timestamps: true });

async function analyzeMoodWithGemini(prompts) {
    const prompt = `Based on these recent user messages, determine if the overall mood is happy, neutral, or sad. Only respond with one word (happy/neutral/sad):
        ${prompts.join('\n')}`;
    
    const result = await model.generateContent(prompt);
    console.log('Gemini response:', result.response.text());
    return result.response.text().toLowerCase().trim();
}

moodSchema.pre('save', async function(next) {
    if (this.isNew) {
        try {
            // Get last 5 prompts from Question model
            const Question = mongoose.model('Question');
            const lastPrompts = await Question.find({ userId: this.userId })
                .sort({ createdAt: -1 })
                .limit(5)
                .select('content');
            
            const promptTexts = lastPrompts.map(q => q.content);
            this.rawPrompts = promptTexts;
            this.analyzedMood = await analyzeMoodWithGemini(promptTexts);
        } catch (error) {
            console.error('Error analyzing mood:', error);
            this.analyzedMood = 'neutral'; // fallback
        }
    }
    next();
});

export const Mood = mongoose.model('Mood', moodSchema);

