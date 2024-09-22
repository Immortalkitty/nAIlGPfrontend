import React, { useEffect, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useOutletContext } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import UserHistory from '../components/UserHistory';
import Authentication from '../components/Authentication';

const Profile = () => {
    const { isLoggedIn, setIsLoggedIn, username, setUsername } = useOutletContext();  // Get context from BaseLayout
    const [loading, setLoading] = useState(true);  // Track loading state

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
        </Box>
    );
};

export default Profile;
