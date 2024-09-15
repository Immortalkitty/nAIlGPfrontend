import { Grid, Modal, Box, Typography, LinearProgress, Tooltip } from '@mui/material';
import React, { useState } from 'react';
import SingleImage from './SingleImage';

const ResultsGallery = ({ results }) => {
    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageClick = (image) => {
        setSelectedImage(image);
    };

    const handleClose = () => {
        setSelectedImage(null);
    };

    const getProgressBarColor = (title) => {
        if (!title) return 'primary';
        return title.toLowerCase().includes('infected') ? 'error' : 'success';
    };

    return (
        <>
            <Grid container spacing={4}>
                {results && results.length > 0 ? (
                    results.slice().reverse().map((result) => (
                        <Grid item key={result.id} xs={12} sm={6} md={4}>
                            <SingleImage image={result} onClick={handleImageClick} />
                        </Grid>
                    ))
                ) : (
                    <Grid item xs={12}>
                        <p>No results available.</p>
                    </Grid>
                )}
            </Grid>
            <Modal
                open={!!selectedImage}
                onClose={handleClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        overflow: 'hidden',
                        width: '80vw',
                        height: '80vh',
                        p: 2,
                    }}
                >
                    {selectedImage && (
                        <>
                            <Typography id="modal-title" variant="h4" component="h2" align="center" gutterBottom>
                                {selectedImage.title}
                            </Typography>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flexGrow: 1,
                                    width: '100%',
                                    height: '100%',
                                    maxWidth: '100%',
                                    maxHeight: '65vh',
                                }}
                            >
                                <Box
                                    component="img"
                                    sx={{
                                        width: 'auto',
                                        height: '100%',
                                        maxWidth: '100%',
                                        objectFit: 'contain',
                                    }}
                                    src={selectedImage.src}
                                    alt={selectedImage.title || 'Large image preview'}
                                />
                            </Box>

                            {/* Confidence Bar */}
                            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: 2 }}>
                                <Box sx={{ width: '60%' }}>
                                    <Typography variant="body2" color="textSecondary">
                                        Confidence:
                                    </Typography>
                                    <Tooltip
                                        title={<Typography sx={{ fontSize: '1.25rem' }}>{((selectedImage.confidence || 0) * 100).toFixed(2)}%</Typography>}
                                        arrow
                                    >
                                        <LinearProgress
                                            variant="determinate"
                                            value={(selectedImage.confidence || 0) * 100}
                                            sx={{
                                                height: 10,
                                                borderRadius: 5,
                                                transition: 'width 1s ease, background-color 1s ease',
                                            }}
                                            color={getProgressBarColor(selectedImage.title)}
                                        />
                                    </Tooltip>
                                </Box>
                            </Box>
                        </>
                    )}
                </Box>
            </Modal>
        </>
    );
};

export default ResultsGallery;
