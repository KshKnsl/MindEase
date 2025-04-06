import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Register from './pages/Auth/Register';
import Login from './pages/Auth/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Planner from './pages/Planner';

const theme = createTheme({
  palette: {
    primary: {
      main: '#7c3aed', // Purple-600
    },
    secondary: {
      main: '#9333ea', // Purple-700
    },
    background: {
      default: '#f5f3ff', // Purple-50
    }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
          <Navbar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/planner" element={<Planner />} />
            <Route path="*" element={<LandingPage />} /> {/* Redirect to LandingPage for any unknown routes */}
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;