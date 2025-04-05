import React, { useState } from 'react';
import { Button } from '../components/ui/button';

const Planner: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [calendarUrl, setCalendarUrl] = useState('');

  const handleAddEvent = () => {
    const title = "My Awesome Event";
    const details = "This is a description of the event.";
    const location = "Online";
    const startDate = "20250405T090000Z";
    const endDate = "20250405T100000Z";

    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      title
    )}&dates=${startDate}/${endDate}&details=${encodeURIComponent(
      details
    )}&location=${encodeURIComponent(location)}&sf=true&output=xml`;

    setCalendarUrl(url);
    setShowPopup(true);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1 className="text-3xl font-bold">Planner</h1>
      <Button onClick={handleAddEvent}>
        Add Event to Google Calendar
      </Button>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h2 className="text-xl font-semibold mb-4">Event Added!</h2>
            <p className="mb-4">Your event has been prepared for Google Calendar.</p>
            <div className="flex space-x-4">
              <Button onClick={() => window.open(calendarUrl, '_blank')}>
                Open Calendar
              </Button>
              <Button 
                onClick={() => setShowPopup(false)}
                variant="outline"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Planner;