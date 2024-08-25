import * as React from 'react';
import { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MainAppComponent from './MainAppComponent';
import ProfileForm from './ProfileForm';
import HelpPopup from './HelpPopup';
import HomeScreen from './HomeScreen';
import axios from 'axios';

const theme = createTheme();

export default function BaseLayout() {
    const [showMainApp, setShowMainApp] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    const [showProfileForm, setShowProfileForm] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

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
            }
        };

        checkLoginStatus();
    }, []);

    const handleHomeClick = () => {
        setShowMainApp(false);
        setShowProfileForm(false);
    };

    const handleProfileClick = () => {
        setShowProfileForm(true);
    };

    const handleHelpClick = () => {
        setShowHelp(true);
    };

    const handleHelpClose = () => {
        setShowHelp(false);
    };

    const handleUploadClick = () => {
        setShowMainApp(true);
    };

    const handleLogoutClick = async () => {
        try {
            await axios.get('http://localhost:5000/auth/logout', { withCredentials: true });
            alert('You have been logged out successfully.');
            setIsLoggedIn(false);
        } catch (error) {
            console.error('Error logging out:', error);
            alert('Logout failed. Please try again.');
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ minHeight: "100vh", flexDirection: "column", display: "flex", background: 'linear-gradient(to right, #e0f7fa, #80deea)'}}>
                <AppBar position="relative" component="header" sx={{ background: '#0CC0DF' }}>
                    <Toolbar>
                        <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
                            nAIlGP
                        </Typography>
                         {isLoggedIn && (
                            <>
                                <IconButton edge="end" color="inherit" aria-label="logout" onClick={handleLogoutClick}>
                                    <ExitToAppIcon sx={{ mr: 2 }} />
                                </IconButton>
                            </>
                        )}
                        <IconButton edge="end" color="inherit" aria-label="account" onClick={handleProfileClick}>
                                    <AccountCircleIcon sx={{ mr: 2 }} />
                        </IconButton>
                        <IconButton edge="end" color="inherit" aria-label="help" onClick={handleHelpClick}>
                            <HelpOutlineIcon sx={{ mr: 2 }} />
                        </IconButton>
                        <IconButton edge="end" color="inherit" aria-label="home" onClick={handleHomeClick}>
                            <HomeIcon sx={{ mr: 2 }} />
                        </IconButton>

                    </Toolbar>
                </AppBar>
                <Box sx={{ p: 6, flex: "1", display: "flex", flexDirection: "column", justifyContent: "center" }} component="main">
                    {showProfileForm ? (
                        <ProfileForm handleHomeClick={handleHomeClick} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
                    ) : showMainApp ? (
                        <MainAppComponent isLoggedIn={isLoggedIn} />
                    ) : (
                        <HomeScreen handleUploadClick={handleUploadClick} />
                    )}
                </Box>
            </Box>
            <HelpPopup open={showHelp} onClose={handleHelpClose} />
        </ThemeProvider>
    );
}
