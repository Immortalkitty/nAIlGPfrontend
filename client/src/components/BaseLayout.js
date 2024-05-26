import * as React from 'react';
import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MainAppComponent from './MainAppComponent';
import ProfileForm from './ProfileForm';
import HelpPopup from './HelpPopup';
import HomeScreen from './HomeScreen';

const theme = createTheme();

export default function BaseLayout() {
    const [showMainApp, setShowMainApp] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    const [showProfileForm, setShowProfileForm] = useState(false);

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

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ minHeight: "100vh", flexDirection: "column", display: "flex", background: 'linear-gradient(to right, #e0f7fa, #80deea)'}}>
                <AppBar position="relative" component="header" sx={{ background: '#0CC0DF' }}>
                    <Toolbar>
                        <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
                            nAIlGP
                        </Typography>
                        <IconButton edge="end" color="inherit" aria-label="help" onClick={handleHelpClick}>
                            <HelpOutlineIcon sx={{ mr: 2 }} />
                        </IconButton>
                        <IconButton edge="end" color="inherit" aria-label="home" onClick={handleHomeClick}>
                            <HomeIcon sx={{ mr: 2 }} />
                        </IconButton>
                        <IconButton edge="end" color="inherit" aria-label="account" onClick={handleProfileClick}>
                            <AccountCircleIcon sx={{ mr: 2 }} />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Box sx={{ p: 6, flex: "1", display: "flex", flexDirection: "column", justifyContent: "center" }} component="main">
                    {showProfileForm ? (
                        <ProfileForm handleHomeClick={handleHomeClick} />
                    ) : showMainApp ? (
                        <MainAppComponent />
                    ) : (
                        <HomeScreen handleUploadClick={handleUploadClick} />
                    )}
                </Box>
            </Box>
            <HelpPopup open={showHelp} onClose={handleHelpClose} />
        </ThemeProvider>
    );
}
