import React, { useState } from 'react';
import { Container, Box, TextField, Button, Typography, Divider } from '@mui/material';
import axios from 'axios';

const ProfileForm = ({ handleHomeClick }) => {

    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [registerError, setRegisterError] = useState('');

    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    const handleRegister = async () => {
        try {
            await axios.post('http://localhost:3001/auth/register', { email: registerEmail, password: registerPassword }, { withCredentials: true });
            alert('User registered successfully');
        } catch (error) {
            setRegisterError(error.response.data);
        }
    };

    const handleLogin = async () => {
        try {
            await axios.post('http://localhost:3001/auth/login', { email: loginEmail, password: loginPassword }, { withCredentials: true });
            alert('User logged in successfully');
        } catch (error) {
            setLoginError(error.response.data);
        }
    };

    return (
        <Container maxWidth="md">
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
                    <Typography variant="subtitle1" align="center" gutterBottom sx={{ mt: 4 }}>
                        Register with other service
                    </Typography>
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
                    <Typography variant="subtitle1" align="center" gutterBottom sx={{ mt: 4 }}>
                        Login with other service
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
};

export default ProfileForm;
