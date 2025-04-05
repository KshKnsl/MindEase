import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apikey = import.meta.env.VITE_Gemini_API_KEY || "";
const genAI = new GoogleGenerativeAI(apikey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
const JournalEntry: React.FC = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setResponse('');

    try {
      const result = await model.generateContent(input);
    const text = result.response.text();
    console.log(text);

      if (text && text.length > 0) {
        setResponse(text);
        
      } else {
        setResponse('No response received.');
      }
    } catch (error) {
      console.error('Error:', error);
      setResponse('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h2>Ask Gemini</h2>
      <input
        type="text"
        placeholder="Type your prompt..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ padding: '0.5rem', width: '60%' }}
      />
      <button onClick={handleAsk} style={{ marginLeft: '1rem', padding: '0.5rem 1rem' }}>
        {loading ? 'Loading...' : 'Ask'}
      </button>

      <div style={{ marginTop: '2rem', whiteSpace: 'pre-wrap' }}>
        <h3>Response:</h3>
        <p>{response}</p>
      </div>
    </div>
  );
};

export default JournalEntry;