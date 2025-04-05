import axios from 'axios';

export const generateSpeech = async (req, res) => {
    try {
        const { text, voiceId = 'en-US-julie' } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }

        const response = await axios({
            method: 'post',
            url: 'https://api.murf.ai/v1/speech/generate',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'api-key': process.env.MURF_API_KEY
            },
            data: {
                text: text,
                voiceId: voiceId,
                pitch: 0,  // Neutral pitch
                rate: 0,   // Normal speaking rate
                style: 'conversational',
                emphasis: 'moderate'
            }
        });

        return res.json({ audioUrl: response.data.audioUrl || response.data.url });
    } catch (error) {
        console.error('Error generating speech:', error);
        return res.status(500).json({ error: 'Failed to generate speech' });
    }
};


