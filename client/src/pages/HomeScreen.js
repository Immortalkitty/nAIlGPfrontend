import React, { useState } from 'react';
import { Box, Button, Container, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HomeAppTitles from '../components/HomeAppTitles';
import { uploadAndPredictImage } from '../utils/uploadAndPredict';  // Import the reusable function

let nextId = 1;

const HomeScreen = () => {
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);
    const [image, setImage] = useState({ src: null, title: null, id: null, confidence: null });
    const navigate = useNavigate();

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUploadClick = async () => {
        if (!file) {
            alert('Please select a file to upload');
            return;
        }

        await uploadAndPredictImage(file, setImage, setError, () => {}, nextId);

        if (!error) {
            navigate('/prediction', { state: { image } });
        }
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
                    spacing={2}
                    justifyContent="center"
                >
                    <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="upload-file"
                        type="file"
                        onChange={handleFileChange}
                    />
                    <label htmlFor="upload-file">
                        <Button sx={{ background: '#0CC0DF' }} variant="contained" component="span">
                            Choose Image
                        </Button>
                    </label>
                    <Button
                        sx={{ background: '#0CC0DF' }}
                        variant="contained"
                        onClick={handleUploadClick}
                        disabled={!file}
                    >
                        Upload and Analyze
                    </Button>
                </Stack>
            </Container>
        </Container>
    );
}

export default HomeScreen;
