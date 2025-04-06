import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PsychologyIcon from '@mui/icons-material/Psychology';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setIsMobileMenuOpen(false);
    
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <Box display="flex" alignItems="center" component={Link} to="/" sx={{ textDecoration: 'none', color: 'inherit' }}>
          <PsychologyIcon sx={{ mr: 1 }} color="primary" />
          <Typography variant="h6" color="inherit" noWrap>
            MindEase
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {/* Desktop Menu */}
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          <Button color="inherit" component={Link} to="/dashboard">
            Dashboard
          </Button>
          <Button color="inherit" component={Link} to="/mood-tracker">
            Mood Tracker
          </Button>
          {!isLoggedIn ? (
            <>
              <Button color="inherit" component={Link} to="/register">
                Register
              </Button>
              <Button variant="contained" color="primary" component={Link} to="/login">
                Login
              </Button>
            </>
          ) : (
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </Box>

        {/* Mobile Menu Button */}
        <IconButton
          sx={{ display: { xs: 'flex', md: 'none' } }}
          edge="end"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>

      {/* Mobile Menu Drawer */}
      <Drawer
        anchor="right"
        open={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      >
        <List sx={{ width: 250 }}>
          <ListItem component={Link} to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} sx={{ cursor: 'pointer' }}>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem component={Link} to="/mood-tracker" onClick={() => setIsMobileMenuOpen(false)} sx={{ cursor: 'pointer' }}>
            <ListItemText primary="Mood Tracker" />
          </ListItem>
          {!isLoggedIn ? (
            <>
              <ListItem component={Link} to="/register" onClick={() => setIsMobileMenuOpen(false)} sx={{ cursor: 'pointer' }}>
                <ListItemText primary="Register" />
              </ListItem>
              <ListItem component={Link} to="/login" onClick={() => setIsMobileMenuOpen(false)} sx={{ cursor: 'pointer' }}>
                <ListItemText primary="Login" />
              </ListItem>
            </>
          ) : (
            <ListItem onClick={handleLogout} sx={{ cursor: 'pointer' }}>
              <ListItemText primary="Logout" />
            </ListItem>
          )}
        </List>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;