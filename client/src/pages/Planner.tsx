import React, { useState } from 'react';
import { 
  Button, 
  TextField, 
  Container, 
  Typography, 
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper
} from '@mui/material';

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
    <Container maxWidth="md">
      <Box display="flex" flexDirection="column" alignItems="center" minHeight="100vh" py={4} gap={2}>
        <Typography variant="h4" component="h1" gutterBottom>
          Planner
        </Typography>
        
        <TextField
          multiline
          rows={4}
          fullWidth
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your event details..."
          variant="outlined"
        />
        
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleAddEvent}
        >
          Process Request
        </Button>

        <Dialog open={showPopup} onClose={() => setShowPopup(false)}>
          <Paper>
            {isEvent ? (
              <>
                <DialogTitle>Event Created!</DialogTitle>
                <DialogContent>
                  <Typography>Your event has been prepared for Google Calendar.</Typography>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => window.open(calendarUrl, '_blank')}>
                    Open Calendar
                  </Button>
                  <Button onClick={() => setShowPopup(false)} variant="outlined">
                    Close
                  </Button>
                </DialogActions>
              </>
            ) : (
              <>
                <DialogTitle>Not an Event</DialogTitle>
                <DialogContent>
                  <Typography>Your request was not recognized as an event.</Typography>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setShowPopup(false)} variant="outlined">
                    Close
                  </Button>
                </DialogActions>
              </>
            )}
          </Paper>
        </Dialog>
      </Box>
    </Container>
  );
};

export default Planner;