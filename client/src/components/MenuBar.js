import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import HomeIcon from "@mui/icons-material/Home";
import AppBar from "@mui/material/AppBar";
import axios from "axios";
import { useTheme } from "@mui/material/styles";  // Import useTheme hook

const menuVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "anticipate" } }
};

const handleLogoutClick = async (setIsLoggedIn) => {
  try {
    await axios.get('http://localhost:5000/auth/logout', { withCredentials: true });
    setIsLoggedIn(false);
  } catch (error) {
    console.error('Error logging out:', error);
  }
};

function MenuBar({ isLoggedIn, setIsLoggedIn, onHelpClick, username }) {
  const theme = useTheme();

  const activeStyle = {
    color: theme.palette.primary.main,
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={menuVariants}
      style={{ width: '100%' }}
    >
      <AppBar position="fixed" component="header" sx={{ background: '#0CC0DF', height: '64px' }}>
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
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
          >
            <AccountCircleIcon sx={{ mr: 2 }} />
          </IconButton>

          {/* Help button */}
          <IconButton edge="end" color="inherit" aria-label="help" onClick={onHelpClick}>
            <HelpOutlineIcon sx={{ mr: 2 }} />
          </IconButton>
          <IconButton
            edge="end"
            color="inherit"
            aria-label="home"
            component={NavLink}
            to="/"
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
          >
            <HomeIcon sx={{ mr: 2 }} />
          </IconButton>
        </Toolbar>
      </AppBar>
    </motion.div>
  );
}

export default MenuBar;
