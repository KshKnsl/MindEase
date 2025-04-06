import express from "express";
import jwt from "jsonwebtoken";
import Response from "../models/Response.js";

const router = express.Router();

router.post("/mood-action", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id; // or decoded._id based on how your token is signed

    // Get last 5 mood-tagged responses
    const recentResponses = await Response.find({ userId })
      .sort({ timestamp: -1 })
      .limit(5)
      .select("moodTag");

    if (recentResponses.length === 0) {
      return res.json({
        mood: "neutral",
        suggestion: "Keep it steady. Want to shuffle through calming quotes?",
        actionType: "showQuote"
      });
    }

    const moodCount = {};
    for (const entry of recentResponses) {
      const mood = entry.moodTag || "neutral";
      moodCount[mood] = (moodCount[mood] || 0) + 1;
    }

    const predominantMood = Object.keys(moodCount).reduce((a, b) =>
      moodCount[a] > moodCount[b] ? a : b
    );

    const moodMap = {
      happy: {
        suggestion: "You seem upbeat! Want to write a positive affirmation?",
        actionType: "positiveAffirmation"
      },
      sad: {
        suggestion: "Feeling low? Let’s draw or doodle something simple.",
        actionType: "drawCanvas"
      },
      anxious: {
        suggestion: "Try this 2-minute breathing bubble.",
        actionType: "playBreathingAnimation"
      },
      angry: {
        suggestion: "Let’s do a quick 10-second body shakeout.",
        actionType: "shakeCountdown"
      },
      depressed: {
        suggestion: "Play relaxing background music?",
        actionType: "playMusic"
      },
      neutral: {
        suggestion: "Keep it steady. Want to shuffle through calming quotes?",
        actionType: "showQuote"
      }
    };

    const { suggestion, actionType } = moodMap[predominantMood] || moodMap["neutral"];

    res.json({
      mood: predominantMood,
      suggestion,
      actionType
    });
  } catch (err) {
    console.error("Mood suggestion fetch failed:", err);
    res.status(500).json({ error: "Failed to get mood-based suggestion." });
  }
});

export  {router};
