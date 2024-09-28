import React, { useEffect, useRef, useState } from 'react';
import { Box, Container, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import axios from 'axios';
import UserAuthForm from './UserAuthForm';
import config from "../../utils/config.js";

const Authentication = ({ setIsLoggedIn, setUsername }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [authMode, setAuthMode] = useState('login');

    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    const validateEmail = (email) => /^[a-zA-Z0-9_-]{3,20}$/.test(email);

    const validatePassword = (password) => /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(password);

    const handleAuthSubmit = async () => {
        if (!email || !validateEmail(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        if (authMode === 'register') {
            if (!password || !validatePassword(password)) {
                setError('Password must be at least 8 characters long, include a number, and a special character.');
                return;
            }

            if (password !== confirmPassword) {
                setError('Passwords do not match.');
                return;
            }

            await handleRegister();
        } else {
            if (!password) {
                setError('Please enter a password.');
                return;
            }

            await handleLogin();
        }
    };

    const handleRegister = async () => {
        try {
            await axios.post(`${config.API_BASE_URL}/auth/register`, { email, password }, { withCredentials: true });
            await handleLogin();
        } catch (error) {
            setError(error.response?.data?.error || 'Registration failed');
        }
    };

    const handleLogin = async () => {
        try {
            await axios.post(`${config.API_BASE_URL}/auth/login`, { email, password }, { withCredentials: true });
            setIsLoggedIn(true);
            const { data: { username } } = await axios.get(`${config.API_BASE_URL}/auth/get-username`, { withCredentials: true });
            setUsername(username);
        } catch (error) {
            setError(error.response?.status === 401 ? 'Password is incorrect' : error.response?.data?.error || 'Login failed');
        }
    };

    const handleModeChange = (event, newMode) => {
        if (newMode) {
            setAuthMode(newMode);
            setError('');
            if (newMode === 'login') {
                setConfirmPassword('');
            }
        }
    };

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleAuthSubmit();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [email, password, confirmPassword]);

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key="authentication-form"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                    exit: { opacity: 0, y: -20, transition: { duration: 0.5 } },
                }}
            >
                <Container maxWidth="sm">
                    <Box sx={{ padding: 2, borderRadius: 2, textAlign: 'center', position: 'relative' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                            <ToggleButtonGroup
                                color="primary"
                                value={authMode}
                                exclusive
                                onChange={handleModeChange}
                                sx={{ width: '100%', maxWidth: 300 }}
                            >
                                <ToggleButton value="login" sx={{ flex: 1 }}>Login</ToggleButton>
                                <ToggleButton value="register" sx={{ flex: 1 }}>Register</ToggleButton>
                            </ToggleButtonGroup>
                        </Box>

                        <UserAuthForm
                            email={email}
                            password={password}
                            setEmail={setEmail}
                            setPassword={setPassword}
                            confirmPassword={confirmPassword}
                            setConfirmPassword={setConfirmPassword}
                            handleSubmit={handleAuthSubmit}
                            error={error}
                            buttonLabel="Submit"
                            emailRef={emailRef}
                            passwordRef={passwordRef}
                            authMode={authMode}
                            setError={setError}
                        />
                    </Box>
                </Container>
            </motion.div>
        </AnimatePresence>
    );
};

export default Authentication;
