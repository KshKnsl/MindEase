import express from 'express';
import { generateSpeech } from '../controllers/ttsController.js';

export const router = express.Router();

router.post('/generate', generateSpeech);
