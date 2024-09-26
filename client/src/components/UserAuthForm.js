import React, { useEffect, useRef } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

const UserAuthForm = ({
    email,
    password,
    setEmail,
    setPassword,
    handleSubmit,
    error,
    buttonLabel,
    emailRef,
    passwordRef,
    confirmPassword,
    setConfirmPassword,
    authMode,
    setError, // Pass setError to clear the error when text changes
}) => {
    const confirmPasswordRef = useRef(null); // Ref for confirm password field

    useEffect(() => {
        // Auto-focus the confirm password field when entering register mode
        if (authMode === 'register' && confirmPasswordRef.current) {
            confirmPasswordRef.current.focus();
        }
    }, [authMode]);

    useEffect(() => {
        // Handling key navigation between email, password, and confirm password
        const handleKeyPress = (e) => {
            if (e.key === 'ArrowDown') {
                if (document.activeElement === emailRef.current) {
                    passwordRef.current?.focus(); // Move focus to password field
                } else if (authMode === 'register' && document.activeElement === passwordRef.current) {
                    confirmPasswordRef.current?.focus(); // Move focus to confirm password field in register mode
                }
            } else if (e.key === 'ArrowUp') {
                if (authMode === 'register' && document.activeElement === confirmPasswordRef.current) {
                    passwordRef.current?.focus(); // Move focus back to password field
                } else if (document.activeElement === passwordRef.current) {
                    emailRef.current?.focus(); // Move focus back to email field
                }
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [authMode]); // Depend on authMode to handle focus between login and register modes

    // Function to set caret position at the end of the text in the input field
    const setCaretPositionAtEnd = (ref) => {
        if (ref.current) {
            const length = ref.current.value.length;
            // Delay execution to ensure focus is fully applied
            setTimeout(() => {
                ref.current.setSelectionRange(length, length); // Set caret at the end of text
            }, 0);
        }
    };

    const errorVariants = {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
        exit: { opacity: 0, x: 50, transition: { duration: 0.3, ease: 'easeIn' } },
    };

    return (
        <Box sx={{ flex: 1, marginX: 2 }}>
            <TextField
                fullWidth
                label="E-mail"
                variant="outlined"
                margin="normal"
                value={email}
                onChange={(e) => {
                    setEmail(e.target.value);
                    setError(''); // Clear error when email changes
                }}
                onFocus={() => setCaretPositionAtEnd(emailRef)} // Set caret at the end on focus
                inputRef={emailRef}
            />
            <TextField
                fullWidth
                label="Password"
                type="password"
                variant="outlined"
                margin="normal"
                value={password}
                onChange={(e) => {
                    setPassword(e.target.value);
                    setError(''); // Clear error when password changes
                }}
                onFocus={() => setCaretPositionAtEnd(passwordRef)} // Set caret at the end on focus
                inputRef={passwordRef}
            />

            {/* Conditionally render the confirm password field when in 'register' mode with animation */}
            <AnimatePresence>
                {authMode === 'register' && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <TextField
                            fullWidth
                            label="Confirm Password"
                            type="password"
                            variant="outlined"
                            margin="normal"
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                setError(''); // Clear error when confirm password changes
                            }}
                            onFocus={() => setCaretPositionAtEnd(confirmPasswordRef)} // Set caret at the end on focus
                            inputRef={confirmPasswordRef}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <Button
                fullWidth
                variant="contained"
                sx={{ mt: 2, backgroundColor: '#0CC0DF' }}
                onClick={handleSubmit}
            >
                {buttonLabel}
            </Button>

            {/* Display error message */}
            <Box sx={{ minHeight: '2.5rem', mt: 2 }}>
                <AnimatePresence mode="wait">
                    {error && (
                        <motion.div
                            key="error"
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={errorVariants}
                        >
                            <Typography color="error" align="center" sx={{ fontSize: '1.2rem' }}>
                                {error}
                            </Typography>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Box>
        </Box>
    );
};

export default UserAuthForm;
