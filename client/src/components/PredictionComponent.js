import React, { useState } from 'react';
import { Box, CircularProgress, Container, Paper, Typography, Button, Stack } from '@mui/material';
import ResultsGallery from './ResultsGallery';
import SingleImage from './SingleImage';
import { CSSTransition } from 'react-transition-group';
import ZoomPictureModal from './ZoomPictureModal'; // Import the renamed ZoomPictureModal component

const PredictionComponent = ({ image, results, error, isImageBeingProcessed, handleUploadNextClick, fileInputRef }) => {
    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageClick = (image) => {
        setSelectedImage(image);
    };

    const handleClose = () => {
        setSelectedImage(null);
    };

    return (
        <Container disableGutters sx={{ flex: "1", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <Container sx={{ pt: 8, pb: 6 }} maxWidth="sm">
                <Box sx={{ minHeight: "300px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {isImageBeingProcessed && !image && <CircularProgress />}
                    {image && (
                        <CSSTransition
                            in={!!image}
                            classNames="my-node"
                            timeout={{
                                appear: 1000,
                                enter: 1000,
                                exit: 1000,
                            }}
                        >
                            <div>
                                <SingleImage image={image} onClick={handleImageClick} />
                            </div>
                        </CSSTransition>
                    )}
                </Box>
                {error && <Typography color="error" align="center">{error}</Typography>}
            </Container>

            <Stack sx={{ pt: 4, alignItems: 'center' }} direction="row" justifyContent="center">
                <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="upload-next-file"
                    type="file"
                    ref={fileInputRef}
                    onChange={handleUploadNextClick}
                />
                <Button sx={{ background: '#0CC0DF' }} variant="contained" onClick={() => fileInputRef.current.click()}>
                    Upload Next Image
                </Button>
            </Stack>

            {!!results.length && (
                <Container sx={{ py: 8 }}>
                    <Typography sx={{ p: 8 }} align="center" variant="h4" component="h3">
                        Recent results:
                    </Typography>
                    <Paper elevation={3} sx={{ p: 4, background: '#0CC0DF' }}>
                        <ResultsGallery results={results} />
                    </Paper>
                </Container>
            )}

            {/* Use ZoomPictureModal instead of ImageModal */}
            <ZoomPictureModal selectedImage={selectedImage} handleClose={handleClose} />
        </Container>
    );
};

export default PredictionComponent;