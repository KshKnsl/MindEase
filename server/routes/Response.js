import express from "express";
import Response from "../models/Response.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { UserProfile } from "../models/UserProfile.js";

const router = express.Router();

router.post("/chat", async (req, res) => {
    try {
        var { prompt, userId } = req.body;
        const token = userId;
        console.log('Token:', token);
        if (!token) {
            return res.status(401).json({ error: 'No token provided. Please authenticate.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        if (!decoded || !decoded.id) {
            return res.status(401).json({ error: 'Invalid token. Please authenticate.' });
        }

        userId = decoded.id;
        console.log("Decoded userId:", userId);
        console.log("Received request body:", req.body);

        console.log("Received request:");
        const apikey = process.env.YOUR_AIMLAPI_KEY;
        const response = await fetch('https://api.aimlapi.com/v1/embeddings', {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${apikey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "text-embedding-ada-002",
                "input": "text",
                "encoding_format": "float"
            })
        });

        if (!response.ok) {
            throw new Error("Failed to fetch embedding");
        }
        const embedJson = await response.json();
        const vector = embedJson.data[0].embedding;

        console.log("Embedding response:", response);

        const similarThoughts = await Response.aggregate([
            {
                $vectorSearch: {
                    index: "yourVectorIndexName",
                    path: "embedding",
                    queryVector: vector,
                    numCandidates: 100,
                    k: 5,
                    limit: 5
                }
            },
            {
                $match: { userId: new mongoose.Types.ObjectId(userId) }
            }
        ]);

        const context = similarThoughts.map(item =>
            `User: "${item.prompt}"\nAI: "${item.response}"`
        ).join("\n\n");

        const finalPrompt = `
    You are a supportive AI emotional twin. Based on the user's past experiences and emotional patterns, help them now.
    
    Here are their previous interactions:
    ${context}
    
    New prompt:
    "${prompt}"
    `;

        console.log("Prompt:", prompt);

        const aiRes = await fetch('http://localhost:5000/api/genai/ask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: finalPrompt }),
        });

        if (!aiRes.ok) {
            throw new Error("Failed to fetch AI response");
        }

        const aiResponse = await aiRes.json();
        console.log("AI Response:", aiResponse.response);

        // 3. Store in MongoDB
        const newResponse = await Response.create({
            userId: new mongoose.Types.ObjectId(userId),
            prompt,
            response: aiResponse.response,
            embedding: vector
        });
        console.log("Stored Response:", newResponse);

        const userProfile = await UserProfile.findOneAndUpdate(
            { userId: new mongoose.Types.ObjectId(userId) }, // Convert userId to ObjectId
            {
                $push: {
                    responses: {
                        question: prompt,
                        answer: aiResponse.response,
                    },
                },
                $set: { updatedAt: Date.now() }, // Update the updatedAt field
            },
            { new: true, upsert: true } // Create a new document if it doesn't exist
        );

        res.status(200).json(aiResponse.response);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to process AI response" });
    }
});

export { router };
