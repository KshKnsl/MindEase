import React from 'react';
import { Button } from '../components/ui/button';

const Planner: React.FC = () => {
  const handleAddEvent = () => {
    const title = "My Awesome Event";
    const details = "This is a description of the event.";
    const location = "Online";
    const startDate = "20250405T090000Z"; // UTC time
    const endDate = "20250405T100000Z";

    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      title
    )}&dates=${startDate}/${endDate}&details=${encodeURIComponent(
      details
    )}&location=${encodeURIComponent(location)}&sf=true&output=xml`;

    window.open(url, '_blank');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1 className="text-3xl font-bold">Planner</h1>
      <Button onClick={handleAddEvent}>
        Add Event to Google Calendar
      </Button>
    </div>
  );
};

export default Planner;