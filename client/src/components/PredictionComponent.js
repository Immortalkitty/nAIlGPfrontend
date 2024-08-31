import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, CircularProgress, Container, Paper, Stack, Typography } from '@mui/material';
import ResultsGallery from './ResultsGallery';
import SingleImage from './SingleImage';
import { CSSTransition } from 'react-transition-group';
import { uploadAndPredictImage } from '../utils/uploadAndPredict';  // Import the reusable function

let nextId = 1;

const PredictionComponent = () => {
    const [results, setResults] = useState([]);
    const [imageTransitionState, setImageTransitionState] = useState(false);
    const [image, setImage] = useState({ src: null, title: null, id: null, confidence: null });
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);
    const showHomeTitlesFlag = useRef(false);
    const isImageBeingProcessed = useRef(false);
    const nodeRef = useRef(null);

    useEffect(() => {
        if (showHomeTitlesFlag.current) {
            showHomeTitlesFlag.current = false;
            setImageTransitionState(true);
        }
    }, [image]);

    const handleImageChange = async (e) => {
        isImageBeingProcessed.current = true;
        setImageTransitionState(false);

        const file = e.target.files[0];
        await uploadAndPredictImage(file, setImage, setError, setResults, nextId);

        showHomeTitlesFlag.current = true;
        setImageTransitionState(true);
        isImageBeingProcessed.current = false;
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
                </Box>
                {error && <Typography color="error" align="center">{error}</Typography>}
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
            {!!results.length && (
                <Container sx={{ py: 8 }}>
                    <Typography sx={{ p: 8 }} align="center" variant="h4" component="h3">Recent results:</Typography>
                    <Paper elevation={3} sx={{ p: 4, background: '#0CC0DF' }}>
                        <ResultsGallery results={results} />
                    </Paper>
                </Container>
            )}
        </Container>
    );
};

export default PredictionComponent;
