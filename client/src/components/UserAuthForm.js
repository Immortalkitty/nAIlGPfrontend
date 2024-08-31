import React from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';

const UserAuthForm = ({
    title,
    email,
    password,
    setEmail,
    setPassword,
    handleSubmit,
    error,
    buttonLabel
}) => {
    return (
        <Box sx={{ flex: 1, marginX: 2 }}>
            <Typography variant="h6" align="center" gutterBottom>
                {title}
            </Typography>
            {error && <Typography color="error">{error}</Typography>}
            <TextField
                fullWidth
                label="E-mail"
                variant="outlined"
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
                fullWidth
                label="Password"
                type="password"
                variant="outlined"
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button
                fullWidth
                variant="contained"
                sx={{ mt: 2, backgroundColor: '#0CC0DF' }}
                onClick={handleSubmit}
            >
                {buttonLabel}
            </Button>
        </Box>
    );
};

export default UserAuthForm;
