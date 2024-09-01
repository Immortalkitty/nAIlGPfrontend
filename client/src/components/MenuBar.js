import React from "react";
import { NavLink } from "react-router-dom";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import HomeIcon from "@mui/icons-material/Home";
import AppBar from "@mui/material/AppBar";
import axios from "axios";

const handleLogoutClick = async (setIsLoggedIn) => {
    try {
        await axios.get('http://localhost:5000/auth/logout', { withCredentials: true });
        alert('You have been logged out successfully.');
        setIsLoggedIn(false);
    } catch (error) {
        console.error('Error logging out:', error);
        alert('Logout failed. Please try again.');
    }
};

function MenuBar({ isLoggedIn, setIsLoggedIn, onHelpClick, username }) {
    return (
        <AppBar position="relative" component="header" sx={{ background: '#0CC0DF' }}>
            <Toolbar>
                <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
                    nAIlGP
                </Typography>
                {isLoggedIn && (
                    <>
                        <Typography variant="body1" color="inherit" sx={{ mr: 2 }}>
                            {username}
                        </Typography>
                        <IconButton edge="end" color="inherit" aria-label="logout" onClick={() => handleLogoutClick(setIsLoggedIn)}>
                            <ExitToAppIcon sx={{ mr: 2 }} />
                        </IconButton>
                    </>
                )}
                <IconButton
                    edge="end"
                    color="inherit"
                    aria-label="account"
                    component={NavLink}
                    to="/profile"
                >
                    <AccountCircleIcon sx={{ mr: 2 }} />
                </IconButton>
                <IconButton
                    edge="end"
                    color="inherit"
                    aria-label="help"
                    onClick={onHelpClick}
                >
                    <HelpOutlineIcon sx={{ mr: 2 }} />
                </IconButton>
                <IconButton
                    edge="end"
                    color="inherit"
                    aria-label="home"
                    component={NavLink}
                    to="/"
                >
                    <HomeIcon sx={{ mr: 2 }} />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
}

export default MenuBar;
