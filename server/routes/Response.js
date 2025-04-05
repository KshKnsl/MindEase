import express from "express";
import axios from "axios";
// import Response from "../models/Response.js"; // your model (commented out as it's unused)

const router = express.Router();

router.post("/chat", async (req, res) => {
  try {
    const { prompt } = req.body; // Removed 'userId' as it's unused
    console.log("Received request:");
    // const apikey = process.env.YOUR_AIMLAPI_KEY;
    // const response = await fetch('https://api.aimlapi.com/v1/embeddings', {
    //     method: 'POST',
    //     headers: {
    //       "Authorization": `Bearer ${apikey}`,
    //       "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify({
    //       "model": "text-embedding-ada-002",
    //       "input": "text",
    //       "encoding_format": "float"
    //     })
    // });
    
    // if (!response.ok) {
    //   throw new Error("Failed to fetch embedding");
    // }
    // console.log("Embedding response:", response);
    // const embedding =  await response.json();

    // 2. Get Gemini response (replace with your actual Gemini call)
   
        console.log("Prompt:", prompt);

        const aiRes = await fetch('http://localhost:5000/api/genai/ask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: prompt }),
        });

        if (!aiRes.ok) {
            throw new Error("Failed to fetch AI response");
        }

        const aiResponse = await aiRes.json();
        console.log("AI Response:", aiResponse.response);

    // 3. Store in MongoDB
    // const newResponse = await Response.create({
    //   userId,
    //   prompt,
    //   response: aiResponse,
    //   embedding
    // });
    // console.log("Stored Response:", newResponse);
    res.status(200).json(aiResponse.response);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to process AI response" });
  }
});

export {router };
