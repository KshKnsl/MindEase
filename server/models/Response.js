import mongoose from "mongoose";

const responseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // or String if you're using custom IDs
    required: true,
    ref: "User"
  },
  prompt: {
    type: String,
    required: true
  },
  response: {
    type: String,
    required: true
  },
  embedding: {
    type: [Number], // array of 1536 floats
    validate: arr => arr.length === 1536
  },
  moodTag: {
    type: String,
    enum: ["happy", "sad", "anxious", "angry", "depressed", "neutral"], // optional
    default: "neutral"
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const Response = mongoose.model("Response", responseSchema);
export default Response;
