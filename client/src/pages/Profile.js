import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Fab } from '@mui/material';
import { KeyboardArrowUp } from '@mui/icons-material';
import axios from 'axios';
import { useOutletContext } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import UserHistory from '../components/UserHistory';
import Authentication from '../components/Authentication';

const Profile = () => {
    const { isLoggedIn, setIsLoggedIn, username, setUsername } = useOutletContext();  // Get context from BaseLayout
    const [loading, setLoading] = useState(true);  // Track loading state
    const [showScroll, setShowScroll] = useState(false);  // Track if the button should be shown

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await axios.get('http://localhost:5000/auth/check-session', { withCredentials: true });
                if (response.data.loggedIn) {
                    setIsLoggedIn(true);
                    const usernameResponse = await axios.get('http://localhost:5000/auth/get-username', { withCredentials: true });
                    setUsername(usernameResponse.data.username);
                } else {
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.error('Error checking session:', error);
                setIsLoggedIn(false);
            } finally {
                setLoading(false);  // Set loading to false when done
            }
        };

        checkLoginStatus();
    }, [setIsLoggedIn, setUsername]);

    // Scroll event listener to show or hide the "Back to Top" button
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowScroll(true);
            } else {
                setShowScroll(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Function to scroll to the top of the page
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const fadeInUpVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
        exit: { opacity: 0, y: -20, transition: { duration: 0.5 } },
    };

    if (loading) {
        return <CircularProgress />;  // Show a loading indicator while checking session status
    }

    return (
        <Box sx={{ p: 4 }}>
            <AnimatePresence mode="wait">
                {isLoggedIn ? (
                    <motion.div
                        key="user-history"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={fadeInUpVariants}
                    >
                        <UserHistory username={username} isLoggedIn={isLoggedIn} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="authentication"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={fadeInUpVariants}
                    >
                        <Authentication setIsLoggedIn={setIsLoggedIn} setUsername={setUsername} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Back to Top Button */}
            {showScroll && (
                <Fab
                    color="primary"
                    size="small"
                    onClick={scrollToTop}
                    sx={{ position: 'fixed', bottom: 16, right: 16 }}
                >
                    <KeyboardArrowUp />
                </Fab>
            )}
        </Box>
    );
};

export default Profile;
