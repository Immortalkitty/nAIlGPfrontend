import { Box, Button, CircularProgress, Container, Paper, Stack, Typography } from '@mui/material';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import ResultsGallery from './ResultsGallery';
import SingleImage from './SingleImage';
import HomeAppTitles from './HomeAppTitles';
import { CSSTransition } from 'react-transition-group';
import axios from 'axios';

let nextId = 1;

const MainAppComponent = () => {
    const [results, setResults] = useState([]);
    const [imageTransitionState, setImageTransitionState] = useState(false);
    const [image, setImage] = useState({ src: null, title: null, id: null, confidence: null });
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);
    const showHomeTitlesFlag = useRef(false);
    const isImageBeingProcessed = useRef(false);
    const nodeRef = useRef(null);  // Ref for CSSTransition

    useEffect(() => {
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
    }, []);

    useEffect(() => {
        if (showHomeTitlesFlag.current) {
            showHomeTitlesFlag.current = false;
            setImageTransitionState(true);
            setResults(results => [...results, image]);
        }
    }, [image]);

    const handleImageChange = async (e) => {
    setError(null); // Reset error state
    isImageBeingProcessed.current = true;
    setImageTransitionState(false);

    const file = e.target.files[0];
    const fileURL = URL.createObjectURL(file);

    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await axios.post('http://localhost:5000/predictions/predict', formData, {
            withCredentials: true,
        });
        const { title, confidence, id, image_src } = response.data;

        const newImage = {
            id: id || nextId++,
            src: fileURL,
            title: capitalizeFirstLetter(title),
            confidence: parseFloat(confidence).toFixed(2)
        };

        setImage(newImage);


        try {
            const saveResponse = await axios.post('http://localhost:5000/predictions/save', {
                title,
                confidence,
                image_src,
            }, {
                withCredentials: true,
            });

            console.log('Prediction saved:', saveResponse.data);
        } catch (saveError) {
            if (saveError.response && saveError.response.status === 401) {
                console.warn('Prediction not saved: User not authenticated.');
                setError('Result not saved. Log in to save your predictions.');
            } else {
                console.error('Error saving prediction:', saveError);
                setError('Error saving prediction.');
            }
        }

        showHomeTitlesFlag.current = true;
        setImageTransitionState(true);
    } catch (err) {
        console.error('Error during prediction:', err);
        setError('Prediction failed. Please try again.');
    } finally {
        isImageBeingProcessed.current = false;
    }
};


    const capitalizeFirstLetter = useCallback((string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }, []);


    useEffect(() => {
        return () => {
            if (image.src) {
                URL.revokeObjectURL(image.src);
            }
        };
    }, [image.src]);

    useEffect(() => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }, []);

    return (
        <Container disableGutters sx={{ flex: "1", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <Container sx={{ pt: 8, pb: 6 }} maxWidth="sm">
                <Box sx={{ minHeight: "300px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {isImageBeingProcessed.current && <CircularProgress />}
                    <CSSTransition
                        in={imageTransitionState}
                        classNames="my-node"
                        timeout={{
                            appear: 1000,
                            enter: 1000,
                            exit: 1000,
                        }}
                        nodeRef={nodeRef}
                    >
                        <div ref={nodeRef}>
                            {imageTransitionState && <SingleImage image={image} />}
                        </div>
                    </CSSTransition>

                    {!(imageTransitionState || !!results.length) &&
                        <>
                            <HomeAppTitles />
                        </>
                    }
                </Box>
                {error && <Typography color="error" align="center">{error}</Typography>} {}
                <Stack
                    sx={{ pt: 4 }}
                    direction="row"
                    spacing={2}
                    justifyContent="center"
                >
                    <Button sx={{ background: '#0CC0DF' }} variant="contained" onClick={() => { fileInputRef.current.click(); }}>
                        <input ref={fileInputRef} type="file" id="image-upload" style={{ display: 'none' }} onChange={handleImageChange} />
                        {!!results.length ? 'Upload next image' : 'Upload image'}
                    </Button>
                </Stack>
            </Container>
            {
                !!results.length &&
                <Container sx={{ py: 8 }}>
                    <Typography sx={{ p: 8 }} align="center" variant="h4" component="h3">Recent results:</Typography>
                    <Paper elevation={3} sx={{ p: 4, background: '#0CC0DF' }}>
                        <ResultsGallery results={results} />
                    </Paper>
                </Container>
            }
        </Container>
    );
}

export default MainAppComponent;
