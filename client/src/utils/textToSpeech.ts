import { ElevenLabsClient } from "elevenlabs";

const client = new ElevenLabsClient({ apiKey: import.meta.env.VITE_ELEVENLABS_API_KEY });
await client.textToSpeech.convert("JBFqnCBsd6RMkjVDRZzb", {
    output_format: "mp3_44100_128",
    text: "The first move is what sets everything in motion.",
    model_id: "eleven_multilingual_v2"
});
