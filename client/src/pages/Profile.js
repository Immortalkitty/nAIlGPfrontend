import React, {useEffect, useState} from 'react';
import {useOutletContext} from 'react-router-dom';
import {Box, Container, Divider, Paper, Typography} from '@mui/material';
import {AnimatePresence, motion} from 'framer-motion'; // Import AnimatePresence
import axios from 'axios';
import UserAuthForm from '../components/UserAuthForm';
import ResultsGallery from '../components/ResultsGallery';

const Profile = () => {
    const {isLoggedIn, setIsLoggedIn, username, setUsername} = useOutletContext();
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
                    const response = await axios.get('http://localhost:5000/predictions/user-predictions', {withCredentials: true});
                    const predictions = response.data.map(prediction => ({
                        src: prediction.image_src,
                        title: prediction.title,
                        confidence: prediction.confidence,
                        id: prediction.id
                    }));
                    console.log("Fetched predictions:", predictions);
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
                {email: registerEmail, password: registerPassword},
                {withCredentials: true}
            );
            setRegisterEmail('');
            setRegisterPassword('');
            setRegisterError('');
            await handleLogin(registerEmail, registerPassword);
        } catch (error) {
            setRegisterError(error.response?.data?.error || 'Registration failed');
        }
    };

    const handleLogin = async (email, password) => {
        try {
            await axios.post('http://localhost:5000/auth/login',
                {email: email || loginEmail, password: password || loginPassword},
                {withCredentials: true}
            );
            setLoginEmail('');
            setLoginPassword('');
            setLoginError('');
            setIsLoggedIn(true);

            const usernameResponse = await axios.get('http://localhost:5000/auth/get-username', {withCredentials: true});
            if (usernameResponse.status === 200) {
                setUsername(usernameResponse.data.username);
            }
        } catch (error) {
            setLoginError(error.response?.data?.error || 'Login failed');
        }
    };

    const fadeInUpVariants = {
        hidden: {opacity: 0, y: 20},
        visible: {opacity: 1, y: 0, transition: {duration: 0.5}},
        exit: {opacity: 0, y: -20, transition: {duration: 0.5}},
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
                        <Box sx={{padding: 1}}>
                            <Typography variant="h4" align="center" sx={{marginBottom: 1, marginTop: 3}}>
                                Welcome, {username}! {/* Display the username */}
                            </Typography>

                            <Typography sx={{marginBottom: 6}} align="center" variant="h4" component="h3">
                                Your Previous Predictions:
                            </Typography>

                            <Paper elevation={3} sx={{p: 4, background: '#0CC0DF'}}>
                                <ResultsGallery results={results}/>
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
                                />
                            </motion.div>

                            <Divider orientation="vertical" flexItem sx={{mx: 2}}/>

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
                                    handleSubmit={() => handleLogin()}
                                    error={loginError}
                                    buttonLabel="Login"
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
