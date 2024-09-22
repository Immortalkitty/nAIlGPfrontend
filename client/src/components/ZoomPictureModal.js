import { Box, Typography, Modal, LinearProgress, Tooltip } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Import AnimatePresence and motion from Framer Motion

const ZoomPictureModal = ({ selectedImage, handleClose, isImageValid }) => {
    const [imageError, setImageError] = useState(false);
    const [showModal, setShowModal] = useState(!!selectedImage);

    useEffect(() => {
        if (selectedImage) {
            setShowModal(true); // Show modal when image is selected
        }
    }, [selectedImage]);

    // Handle image load error
    const handleImageError = () => {
        setImageError(true);
    };

    const closeWithAnimation = () => {
        setShowModal(false); // Trigger exit animation
        setTimeout(handleClose, 200); // Delay actual close until animation is done
    };

    // Function to determine the color of the progress bar based on the image title
    const getProgressBarColor = (title) => {
        if (!title) return 'primary';
        return title.toLowerCase().includes('infected') ? 'error' : 'success';
    };

    // Predefine modal size based on image validity
    const modalSize = isImageValid && !imageError ? { width: '80vw', height: '80vh' } : { width: '30vw', height: 'auto' };

    return (
        <Modal
            open={showModal} // Control modal visibility
            onClose={closeWithAnimation} // Handle close with animation
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            keepMounted // Keeps modal mounted for animation
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <AnimatePresence>
                {selectedImage && showModal && (
                    <motion.div
                        key="zoom-modal"
                        initial={{ opacity: 0, scale: 0.8 }} // Initial pop-up and fade-in state
                        animate={{ opacity: 1, scale: 1 }}   // Final state when fully open
                        exit={{ opacity: 0, scale: 0.8 }}    // Exit state when closing
                        transition={{ duration: 0.2, ease: 'easeInOut' }} // Smooth transition duration
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                bgcolor: 'background.paper',
                                boxShadow: 24,
                                p: 2,
                                borderRadius: 2,
                                ...modalSize,  // Use predefined size based on image validity
                            }}
                        >
                            {selectedImage && (
                                <>
                                    <Typography id="modal-title" variant="h4" component="h2" align="center" gutterBottom>
                                        {selectedImage.title || 'Image Preview'}
                                    </Typography>

                                    {isImageValid && !imageError ? (
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
                                                alt={selectedImage.title || 'Image preview not available'}
                                                onError={handleImageError}
                                            />
                                        </Box>
                                    ) : (
                                        <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 2 }}>
                                            Image not available
                                        </Typography>
                                    )}

                                    {/* Confidence Bar (always visible) */}
                                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: 2 }}>
                                        <Box sx={{ width: '60%' }}>
                                            <Typography variant="body4" color="textSecondary" sx={{ fontSize: '1.25rem' }}>
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
                    </motion.div>
                )}
            </AnimatePresence>
        </Modal>
    );
};

export default ZoomPictureModal;
