import React, { useState } from 'react';

const JournalEntry: React.FC = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setResponse('');

    try {
      const res = await fetch('http://localhost:5000/api/genai/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: input }),
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }

      const data = await res.json();
      setResponse(data.response || 'No response received.');
    } catch (error) {
      console.error('Error:', error);
      setResponse('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Ask Gemini</h2>
      <input
        type="text"
        placeholder="Type your prompt..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="border rounded-lg p-2 w-full mb-4"
      />
      <button
        onClick={handleAsk}
        className="bg-purple-600 text-white px-4 py-2 rounded-lg"
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Ask'}
      </button>

      <div className="mt-4">
        <h3 className="text-lg font-semibold">Response:</h3>
        <p className="whitespace-pre-wrap">{response}</p>
      </div>
    </div>
  );
};

export default JournalEntry;