import { Box, Button, CircularProgress, Container, Paper, Stack, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import ResultsGallery from './ResultsGallery';
import SingleImage from './SingleImage';
import HomeAppTitles from './HomeAppTitles';
import { CSSTransition } from 'react-transition-group';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs-backend-cpu';
import axios from 'axios';

let nextId = 1;

const MainAppComponent = () => {
    const [results, setResults] = useState([]);
    const [imageTransitionState, setImageTransitionState] = useState(false);
    const fileInputRef = useRef(null);
    const showHomeTitlesFlag = useRef(false);
    const isImageBeingProcessed = useRef(false);
    const [loadCNNModel, setCNNModel] = useState(null);
    const [image, setImage] = useState({ src: null, title: null, id: null, description: null, confidence: null });

    useEffect(() => {
        // Set backend and load model
        const loadModel = async () => {
            await tf.setBackend('webgl');
            await tf.ready();
            const model = await mobilenet.load();
            setCNNModel(model);
        };
        loadModel();

        // Fetch predictions from the server
        const fetchPredictions = async () => {
            try {
                const response = await axios.get('http://localhost:3001/predictions/user-predictions', { withCredentials: true });
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

            // Send data to the server
            const formData = new FormData();
            formData.append('image', fileInputRef.current.files[0]);
            formData.append('title', image.title);
            formData.append('confidence', image.confidence);

            console.log('Sending data to server:', formData);

            axios.post('http://localhost:3001/predictions/save', formData, {
                withCredentials: true // Ensure credentials are sent with the request
            })
                .then(response => {
                    console.log('Prediction saved:', response.data);
                })
                .catch(error => {
                    console.error('Error saving prediction:', error.response ? error.response.data : error.message);
                });
        }
    }, [image]);

    const loadModelImage = (src) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.addEventListener('load', () => resolve(img));
            img.addEventListener('error', (err) => reject(err));
            img.src = src;
        });
    };

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const handleImageChange = async (e) => {
        if (!loadCNNModel) return;  // Check if the model is loaded
        isImageBeingProcessed.current = true;
        setImageTransitionState(false);
        const fileURL = URL.createObjectURL(e.target.files[0]); // Create URL once and reuse

        try {
            const img = await loadModelImage(fileURL);
            const predictions = await loadCNNModel.classify(img);

            if (predictions && predictions.length > 0) {
                setImage({
                    id: nextId++,
                    src: fileURL,
                    title: capitalizeFirstLetter(predictions[0].className.split(',')[0]),
                    confidence: parseFloat(predictions[0].probability).toFixed(2),
                });
                showHomeTitlesFlag.current = true; // Set flags or other state-related actions post-update
            }
        } catch (err) {
            console.error(err);
        } finally {
            isImageBeingProcessed.current = false; // Ensure flag is reset even if there is an error
        }
    };

    useEffect(() => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }, []);

    return (
        <Container disableGutters sx={{ flex: "1", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <Container sx={{ pt: 8, pb: 6 }} maxWidth="sm">
                <Box sx={{ minHeight: "300px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {isImageBeingProcessed.current &&
                        <CircularProgress />
                    }
                    <CSSTransition
                        in={imageTransitionState}
                        classNames="my-node"
                        timeout={{
                            appear: 1000,
                            enter: 1000,
                            exit: 1000,
                        }}
                    >
                        {imageTransitionState ? <SingleImage image={image} /> : <React.Fragment />}
                    </CSSTransition>

                    {!(imageTransitionState || !!results.length) &&
                        <>
                            <HomeAppTitles />
                        </>
                    }
                </Box>
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
