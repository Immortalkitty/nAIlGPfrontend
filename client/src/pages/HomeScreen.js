import React from 'react';
import { Box, Button, Container, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HomeAppTitles from '../components/HomeAppTitles';

const HomeScreen = () => {
    const navigate = useNavigate();

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Navigate to the PredictionComponent, passing the file as a prop
            navigate('/prediction', { state: { file } });
        }
    };

    const handleClick = () => {
        document.getElementById('upload-file').click();
    };

    return (
        <Container disableGutters sx={{ flex: "1", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <Container sx={{ pt: 8, pb: 6 }} maxWidth="sm">
                <Box sx={{ minHeight: "300px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <HomeAppTitles />
                </Box>
                <Stack
                    sx={{ pt: 4 }}
                    direction="row"
                    justifyContent="center"
                >
                    <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="upload-file"
                        type="file"
                        onChange={handleFileChange}
                    />
                    <Button sx={{ background: '#0CC0DF' }} variant="contained" onClick={handleClick}>
                        Upload and Analyze
                    </Button>
                </Stack>
            </Container>
        </Container>
    );
}

export default HomeScreen;
