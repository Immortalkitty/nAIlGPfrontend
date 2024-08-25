import React, { useEffect, useState } from 'react';
import { Container, Box, TextField, Button, Typography, Divider } from '@mui/material';
import axios from 'axios';
import ResultsGallery from './ResultsGallery';
import MainAppComponent from "./MainAppComponent";

const ProfileForm = ({isLoggedIn, setIsLoggedIn }) => {
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [registerError, setRegisterError] = useState('');

    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    const [predictions, setPredictions] = useState([]);
    const [loadingPredictions, setLoadingPredictions] = useState(false);

    useEffect(() => {
        if (isLoggedIn) {
            const fetchPredictions = async () => {
                setLoadingPredictions(true);
                try {
                    const response = await axios.get('http://localhost:5000/predictions/user-predictions', { withCredentials: true });
                    setPredictions(response.data);
                } catch (error) {
                    console.error('Error fetching predictions:', error.response ? error.response.data : error.message);
                } finally {
                    setLoadingPredictions(false);
                }
            };
            fetchPredictions();
        }
    }, [isLoggedIn]);

    const handleRegister = async () => {
        try {
            await axios.post('http://localhost:5000/auth/register',
                { email: registerEmail, password: registerPassword },
                { withCredentials: true }
            );
            alert('User registered successfully');
            setRegisterEmail('');
            setRegisterPassword('');
            setRegisterError('');
        } catch (error) {
            setRegisterError(error.response?.data?.error || 'Registration failed');
        }
    };

    const handleLogin = async () => {
        try {
            await axios.post('http://localhost:5000/auth/login',
                { email: loginEmail, password: loginPassword },
                { withCredentials: true }
            );
            alert('User logged in successfully');
            setLoginEmail('');
            setLoginPassword('');
            setLoginError('');
            setIsLoggedIn(true);
        } catch (error) {
            setLoginError(error.response?.data?.error || 'Login failed');
        }
    };

    return (
        <Container maxWidth="md">
            {!isLoggedIn && (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        padding: 2,
                        borderRadius: 2,
                    }}
                >
                    <Box sx={{ flex: 1, marginRight: 2 }}>
                        <Typography variant="h6" align="center" gutterBottom>
                            Register via nAIlGP
                        </Typography>
                        {registerError && <Typography color="error">{registerError}</Typography>}
                        <TextField
                            fullWidth
                            label="E-mail"
                            variant="outlined"
                            margin="normal"
                            value={registerEmail}
                            onChange={(e) => setRegisterEmail(e.target.value)}
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            variant="outlined"
                            margin="normal"
                            value={registerPassword}
                            onChange={(e) => setRegisterPassword(e.target.value)}
                        />
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{ mt: 2, backgroundColor: '#0CC0DF' }}
                            onClick={handleRegister}
                        >
                            Register
                        </Button>
                    </Box>
                    <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
                    <Box sx={{ flex: 1, marginLeft: 2 }}>
                        <Typography variant="h6" align="center" gutterBottom>
                            Login via nAIlGP
                        </Typography>
                        {loginError && <Typography color="error">{loginError}</Typography>}
                        <TextField
                            fullWidth
                            label="E-mail"
                            variant="outlined"
                            margin="normal"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            variant="outlined"
                            margin="normal"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                        />
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{ mt: 2, backgroundColor: '#0CC0DF' }}
                            onClick={handleLogin}
                        >
                            Login
                        </Button>
                    </Box>
                </Box>
            )}

            {isLoggedIn && (
                <Box mt={4}>
                    <Typography variant="h6" align="center" gutterBottom>
                        Your Prediction History
                    </Typography>
                    <MainAppComponent></MainAppComponent>
                </Box>
            )}
        </Container>
    );
};

export default ProfileForm;
