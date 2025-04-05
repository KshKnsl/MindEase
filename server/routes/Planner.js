import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const apikey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apikey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const YesOrNo = `Analyze the message and respond with ONLY "yes" or "no": Is the user trying to schedule an event or task?`;

// Fix the route to be relative to the router's base path
router.post("/ask", async (req, res) => {
    try {
        console.log('Planner API request received:', req.body);
        const { prompt, userId } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required." });
        }

        // Skip user profile fetching for now to simplify debugging
        const contextWithProfile = YesOrNo;

        console.log('Checking if message is about scheduling...');
        const result = await model.generateContent({
            contents: [
                {
                    role: "user",
                    parts: [{ text: contextWithProfile }, { text: prompt }],
                },
            ],
        });

        const text = result.response.text();
        console.log('AI response for scheduling check:', text);

        // Check if the response is "yes"
        if (text.substring(0, 3).toLowerCase() === "yes" && prompt.trim().split(/\s+/).length > 1) {
            console.log('Message is about scheduling, extracting event details...');
            
            // Create simple default event details in case extraction fails
            const defaultEventDetails = { 
            title: "New Event", 
            details: prompt, 
            location: "", 
            startDate: "20240501T090000", 
            endDate: "20240501T100000" 
            };
            
            try {
            // Generate Google Calendar URL with default details
            const { title, details, location, startDate, endDate } = defaultEventDetails;
            const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                title
            )}&dates=${startDate}/${endDate || startDate}&details=${encodeURIComponent(
                details
            )}&location=${encodeURIComponent(location)}&sf=true&output=xml`;

            console.log('Generated calendar URL:', url);
            res.json({ 
                response: "Yes, this is about scheduling an event.",
                eventDetails: defaultEventDetails, 
                calendarUrl: url 
            });
            } catch (error) {
            console.error("Error generating calendar URL:", error);
            res.status(500).json({ error: "Failed to generate calendar URL" });
            }
        } else {
            console.log('Message is not about scheduling');
            res.json({ response: "no" });
        }
    } catch (error) {
        console.error("Error in planner route:", error);
        res.status(500).json({ error: "Failed to process the request." });
    }
});

// Export the router
export default router;
