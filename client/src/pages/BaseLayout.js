import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MenuBar from "../components/MenuBar";
import HelpPopup from '../components/HelpPopup';
import axios from 'axios';

const theme = createTheme();

function BaseLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get('http://localhost:5000/auth/check-session', { withCredentials: true });
        if (response.status === 200) {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setIsLoggedIn(false);
        navigate('/'); // Redirect to home if not logged in
      }
    };

    checkLoginStatus();
  }, [navigate]);

  const handleHelpClick = () => {
    setShowHelp(true);
  };

  const handleHelpClose = () => {
    setShowHelp(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: "100vh", flexDirection: "column", display: "flex", background: 'linear-gradient(to right, #e0f7fa, #80deea)'}}>
        <MenuBar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} onHelpClick={handleHelpClick} />
        <Box sx={{ p: 6, flex: "1", display: "flex", flexDirection: "column", justifyContent: "center" }} component="main">
          <Outlet context={{ isLoggedIn, setIsLoggedIn }} />
        </Box>
      </Box>
      <HelpPopup open={showHelp} onClose={handleHelpClose} />
    </ThemeProvider>
  );
}

export default BaseLayout;
