import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Container, Box, Divider, Typography } from '@mui/material';
import axios from 'axios';
import UserAuthForm from '../components/UserAuthForm';
import ResultsGallery from '../components/ResultsGallery';

const Profile = () => {
    const { isLoggedIn, setIsLoggedIn } = useOutletContext(); // Use the context from Outlet
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [registerError, setRegisterError] = useState('');

    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    const [results, setResults] = useState([]);

    useEffect(() => {
        if (isLoggedIn) {
            const fetchPredictions = async () => {
                try {
                    const response = await axios.get('http://localhost:5000/predictions/user-predictions', { withCredentials: true });
                    const predictions = response.data.map(prediction => ({
                        src: prediction.image_src,
                        title: prediction.title,
                        confidence: prediction.confidence,
                        id: prediction.id
                    }));
                    setResults(predictions);
                } catch (error) {
                    console.error('Error fetching predictions:', error.response ? error.response.data : error.message);
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
            {isLoggedIn ? (
                <Box sx={{ padding: 2 }}>
                    <Typography variant="h4" align="center" gutterBottom>
                        Your Predictions
                    </Typography>
                    <ResultsGallery results={results} />
                </Box>
            ) : (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        padding: 2,
                        borderRadius: 2,
                    }}
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
                    />
                    <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
                    <UserAuthForm
                        title="Login via nAIlGP"
                        email={loginEmail}
                        password={loginPassword}
                        setEmail={setLoginEmail}
                        setPassword={setLoginPassword}
                        handleSubmit={handleLogin}
                        error={loginError}
                        buttonLabel="Login"
                    />
                </Box>
            )}
        </Container>
    );
};

export default Profile;
