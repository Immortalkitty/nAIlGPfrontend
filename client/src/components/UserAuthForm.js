import React, { useEffect } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';

const UserAuthForm = ({
    title,
    email,
    password,
    setEmail,
    setPassword,
    handleSubmit,
    error,
    buttonLabel,
    setFocus // New prop to set the focus on active form
}) => {

    return (
        <Box sx={{ flex: 1, marginX: 2 }}>
            <Typography variant="h6" align="center" gutterBottom>
                {title}
            </Typography>
            <TextField
                fullWidth
                label="E-mail"
                variant="outlined"
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocus()}
            />
            <TextField
                fullWidth
                label="Password"
                type="password"
                variant="outlined"
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocus()}
            />
            <Button
                fullWidth
                variant="contained"
                sx={{ mt: 2, backgroundColor: '#0CC0DF' }}
                onClick={handleSubmit}
            >
                {buttonLabel}
            </Button>
            {error && (
                <Typography color="error" align="center" sx={{ mt: 2 , fontSize: '1.2rem', marginTop:'36px'}}>
                    {error}
                </Typography>
            )}
        </Box>
    );
};

export default UserAuthForm;
