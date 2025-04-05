import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

const apikey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apikey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const YesOrNo = `Just tell me "yes" or "no" to the question: Is the user trying to schedule some task? You will only respond in "yes" or "no".`;
app.post("/api/genai/ask", async (req, res) => {
    try {
        const { prompt, conversationHistory = [], saveQuestion = false } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required." });
        }

        // Check if the user has a profile and include it in the context
        let userContext = "";
        if (req.userId) {
            try {
                const { UserProfile } = await import("../models/UserProfile.js");
                const profile = await UserProfile.findOne({ userId: req.userId });

                if (profile && profile.responses.length > 0) {
                    userContext =
                        "User Profile Information:\n" +
                        profile.responses
                            .map((r) => `Q: ${r.question}\nA: ${r.answer}`)
                            .join("\n\n") +
                        "\n\nPlease use this information about the user to personalize your responses.";
                }
            } catch (error) {
                console.error("Error fetching user profile:", error.message);
            }
        }

        const contextWithProfile = userContext
            ? `${YesOrNo}\n\n${userContext}`
            : YesOrNo;

        const result = await model.generateContent({
            contents: [
                {
                    role: "user",
                    parts: [{ text: contextWithProfile }, { text: prompt }],
                },
            ],
        });

        const text = result.response.text();

        // Check if the response is "yes"
        if (text.trim().toLowerCase() === "yes") {
            const analysisResult = await model.generateContent({
            contents: [
                {
                role: "user",
                parts: [
                    {
                    text: "Analyze the following prompt and extract the event details: title, details, location, startDate, endDate. If any field is not determinable, leave it blank.",
                    },
                    { text: prompt },
                ],
                },
            ],
            });

            const analysisText = analysisResult.response.text();
            let title = "",
            details = "",
            location = "",
            startDate = "",
            endDate = "";

            // Extract the details from the analysis response
            try {
            const parsed = JSON.parse(analysisText);
            title = parsed.title || "";
            details = parsed.details || "";
            location = parsed.location || "";
            startDate = parsed.startDate || "";
            endDate = parsed.endDate || "";
            } catch (error) {
            console.error("Error parsing analysis response:", error.message);
            }

            const responseData = {
            response: text,
            eventDetails: { title, details, location, startDate, endDate },
            };

            const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
            title
            )}&dates=${startDate}/${endDate}&details=${encodeURIComponent(
            details
            )}&location=${encodeURIComponent(location)}&sf=true&output=xml`;

            res.json({ response: text, calendarUrl: url });
        } else {
            res.json({ response: text });
        }
    } catch (error) {
        console.error("Error interacting with Gemini:", error.message);
        res.status(500).json({ error: "Failed to process the request." });
    }
});

// Add a simple endpoint to evaluate a "think" and return the result
router.get("/think", (req, res) => {
  const result = evaluateThink();
  res.json({ result });
});

// Export the router as default
export default router;
