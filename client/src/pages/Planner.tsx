import React, { useState } from 'react';
import { Button } from '../components/ui/button';

const Planner: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [calendarUrl, setCalendarUrl] = useState('');
  const [prompt, setPrompt] = useState('');
  const [isEvent, setIsEvent] = useState(false);

  const handleAddEvent = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      
      if (data.calendarUrl) {
        setCalendarUrl(data.calendarUrl);
        setIsEvent(true);
      } else {
        setIsEvent(false);
      }
      setShowPopup(true);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1 className="text-3xl font-bold">Planner</h1>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-96 h-32 p-2 border rounded"
        placeholder="Enter your event details..."
      />
      <Button onClick={handleAddEvent}>Process Request</Button>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            {isEvent ? (
              <>
                <h2 className="text-xl font-semibold mb-4">Event Created!</h2>
                <p className="mb-4">Your event has been prepared for Google Calendar.</p>
                <div className="flex space-x-4">
                  <Button onClick={() => window.open(calendarUrl, '_blank')}>
                    Open Calendar
                  </Button>
                  <Button onClick={() => setShowPopup(false)} variant="outline">
                    Close
                  </Button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold mb-4">Not an Event</h2>
                <p className="mb-4">Your request was not recognized as an event.</p>
                <Button onClick={() => setShowPopup(false)} variant="outline">
                  Close
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Planner;