import React, {useEffect, useRef, useState} from 'react';
import {Box, Container, ToggleButton, ToggleButtonGroup} from '@mui/material';
import {AnimatePresence, motion} from 'framer-motion';
import axios from 'axios';
import UserAuthForm from '../components/UserAuthForm';

const Authentication = ({setIsLoggedIn, setUsername}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [authMode, setAuthMode] = useState('login');

    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    // Regex for email validation
    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9_-]{3,20}$/;
        return emailRegex.test(email);
    };

    // Password validation logic
    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        return passwordRegex.test(password);
    };

    // Handle form submission
    const handleAuthSubmit = async () => {
    // Common validation for both login and registration
    if (!email || !validateEmail(email)) {
        setError('Please enter a valid email address.');
        return;
    }

    if (!password || !validatePassword(password)) {
        setError('Password must be at least 8 characters long, include a number, and a special character.');
        return;
    }

    // Specific validation for registration mode
    if (authMode === 'register') {
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
    }

    setError('');  // Clear any previous error if validation passes

    if (authMode === 'register') {
        await handleRegister();
    } else {
        await handleLogin();
    }
};


    // Register user
    const handleRegister = async () => {
        try {
            await axios.post('http://localhost:5000/auth/register', {email, password}, {withCredentials: true});
            await handleLogin();  // Automatically log in after registration
        } catch (error) {
            setError(error.response?.data?.error || 'Registration failed');
        }
    };

    // Login user
    const handleLogin = async () => {
        try {
            await axios.post('http://localhost:5000/auth/login', {email, password}, {withCredentials: true});
            setIsLoggedIn(true);
            const usernameResponse = await axios.get('http://localhost:5000/auth/get-username', {withCredentials: true});
            setUsername(usernameResponse.data.username);
        } catch (error) {
            setError(error.response?.data?.error || 'Login failed');
        }
    };

    // Handle auth mode toggle
    const handleModeChange = (event, newMode) => {
        if (newMode !== null) {
            setAuthMode(newMode);
        }
        setError('');  // Clear error when switching modes
    };

    // Add event listener to handle the "Enter" key press
useEffect(() => {
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent the default Enter key behavior
            handleAuthSubmit();  // Call the submit function when "Enter" is pressed
        }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
        window.removeEventListener('keydown', handleKeyPress);
    };
}, [email, password, confirmPassword]); // Depend on email and password so the latest values are used

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key="authentication-form"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={{
                    hidden: {opacity: 0, y: 20},
                    visible: {opacity: 1, y: 0, transition: {duration: 0.5}},
                    exit: {opacity: 0, y: -20, transition: {duration: 0.5}},
                }}
            >
                <Container maxWidth="sm">
                    <Box sx={{padding: 2, borderRadius: 2, textAlign: 'center', position: 'relative'}}>


                        <Box sx={{display: 'flex', justifyContent: 'center', mb: 3}}>
                            <ToggleButtonGroup
                                color="primary"
                                value={authMode}
                                exclusive
                                onChange={handleModeChange}
                                sx={{width: '100%', maxWidth: 300}}
                            >
                                <ToggleButton value="login" sx={{flex: 1}}>Login</ToggleButton>
                                <ToggleButton value="register" sx={{flex: 1}}>Register</ToggleButton>
                            </ToggleButtonGroup>
                        </Box>

                        {/* Form component */}
                        <UserAuthForm
                            email={email}
                            password={password}
                            setEmail={setEmail}
                            setPassword={setPassword}
                            confirmPassword={confirmPassword}  // Pass confirm password state
                            setConfirmPassword={setConfirmPassword}  // Set confirm password
                            handleSubmit={handleAuthSubmit}
                            error={error}
                            buttonLabel="Submit"
                            emailRef={emailRef}
                            passwordRef={passwordRef}
                            authMode={authMode}  // Pass authMode to conditionally render fields
                        />
                    </Box>
                </Container>
            </motion.div>
        </AnimatePresence>
    );
};

export default Authentication;