import React, { useEffect, useState, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Box, Container, Divider, Paper, Typography, Button, CircularProgress } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import axios from 'axios';
import UserAuthForm from '../components/UserAuthForm';
import ResultsGallery from '../components/ResultsGallery';

const Profile = () => {
    const { isLoggedIn, setIsLoggedIn, username, setUsername } = useOutletContext();
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [registerError, setRegisterError] = useState('');

    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    const [results, setResults] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const isFetching = useRef(false);
    const activeForm = useRef(null); // Track which form is active

    useEffect(() => {
        if (isLoggedIn && !isFetching.current) {
            setResults([]);
            setPage(1);
            setHasMore(true);
            fetchPredictions(1);
        }
    }, [isLoggedIn]);

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === 'Enter') {
                // Trigger submit on the currently active form only
                if (activeForm.current === 'register' && registerEmail && registerPassword) {
                    handleRegister();
                } else if (activeForm.current === 'login' && loginEmail && loginPassword) {
                    handleLogin();
                }
            }
        };

        window.addEventListener('keypress', handleKeyPress);
        return () => {
            window.removeEventListener('keypress', handleKeyPress);
        };
    }, [registerEmail, registerPassword, loginEmail, loginPassword]);

    const fetchPredictions = async (pageNumber) => {
        if (isFetching.current || !hasMore) return;
        isFetching.current = true;

        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:5000/predictions/user-predictions?page=${pageNumber}&limit=10`, { withCredentials: true });
            const predictions = response.data.predictions.map(prediction => ({
                src: prediction.image_src,
                title: prediction.title,
                confidence: prediction.confidence,
                id: prediction.id
            }));
            setResults(prevResults => [...prevResults, ...predictions]);
            setHasMore(response.data.has_more);
            setPage(pageNumber);
        } catch (error) {
            console.error('Error fetching predictions:', error.response ? error.response.data : error.message);
        } finally {
            setLoading(false);
            isFetching.current = false;
        }
    };

    const handleLoadMore = () => {
        if (hasMore && !isFetching.current) {
            fetchPredictions(page + 1);
        }
    };

    const handleRegister = async () => {
    try {
        // Register the user
        await axios.post('http://localhost:5000/auth/register',
            { email: registerEmail, password: registerPassword },
            { withCredentials: true }
        );

        // Clear register form fields and errors
        setRegisterEmail('');
        setRegisterPassword('');
        setRegisterError('');

        // Automatically log in the user with the registered credentials
        await handleLogin(registerEmail, registerPassword); // Pass the email and password here
    } catch (error) {
        // Handle registration errors
        setRegisterError(error.response?.data?.error || 'Registration failed');
    }
};


    const handleLogin = async (email = loginEmail, password = loginPassword) => {
    try {
        // Log in the user with the provided email and password
        await axios.post('http://localhost:5000/auth/login',
            { email, password },
            { withCredentials: true }
        );

        // Clear login form fields and errors
        setLoginEmail('');
        setLoginPassword('');
        setLoginError('');

        // Set the user as logged in
        setIsLoggedIn(true);

        // Fetch the logged-in username
        const usernameResponse = await axios.get('http://localhost:5000/auth/get-username', { withCredentials: true });
        if (usernameResponse.status === 200) {
            setUsername(usernameResponse.data.username);
        }
    } catch (error) {
        // Handle login errors
        setLoginError(error.response?.data?.error || 'Login failed');
    }
};

    const fadeInUpVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
        exit: { opacity: 0, y: -20, transition: { duration: 0.5 } },
    };

    return (
        <Container maxWidth="md">
            <AnimatePresence mode="wait">
                {isLoggedIn ? (
                    <motion.div
                        key="logged-in"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={fadeInUpVariants}
                    >
                        <Box sx={{ padding: 1 }}>
                            <Typography variant="h4" align="center" sx={{ marginBottom: 1, marginTop: 3 }}>
                                Welcome, {username}!
                            </Typography>

                            <Typography sx={{ marginBottom: 6 }} align="center" variant="h4" component="h3">
                                Your Previous Predictions:
                            </Typography>

                            <Paper elevation={3} sx={{ p: 4, background: '#0CC0DF' }}>
                                <ResultsGallery results={results} />
                                {loading && <CircularProgress />}
                                {hasMore && (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                        <Button onClick={handleLoadMore} variant="contained" sx={{ background: '#0CC0DF' }}>
                                            Load More
                                        </Button>
                                    </Box>
                                )}
                            </Paper>
                        </Box>
                    </motion.div>
                ) : (
                    <motion.div
                        key="login-register"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={fadeInUpVariants}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                padding: 2,
                                borderRadius: 2,
                            }}
                        >
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                variants={fadeInUpVariants}
                            >
                                <UserAuthForm
                                    title="Register via nAIlGP"
                                    email={registerEmail}
                                    password={registerPassword}
                                    setEmail={setRegisterEmail}
                                    setPassword={setRegisterPassword}
                                    handleSubmit={handleRegister}
                                    error={registerError}
                                    buttonLabel="Register"
                                    setFocus={() => activeForm.current = 'register'}
                                />
                            </motion.div>

                            <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />

                            <motion.div
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                variants={fadeInUpVariants}
                            >
                                <UserAuthForm
                                    title="Login via nAIlGP"
                                    email={loginEmail}
                                    password={loginPassword}
                                    setEmail={setLoginEmail}
                                    setPassword={setLoginPassword}
                                    handleSubmit={handleLogin}
                                    error={loginError}
                                    buttonLabel="Login"
                                    setFocus={() => activeForm.current = 'login'}
                                />
                            </motion.div>
                        </Box>
                    </motion.div>
                )}
            </AnimatePresence>
        </Container>
    );
};

export default Profile;
