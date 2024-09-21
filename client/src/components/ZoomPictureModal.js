import { Box, Typography, Modal } from '@mui/material';
import React, { useState } from 'react';

const ZoomPictureModal = ({ selectedImage, handleClose }) => {
    const [imageError, setImageError] = useState(false);

    // Function to handle image load error
    const handleImageError = () => {
        setImageError(true);
    };

    return (
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
                    width: imageError ? '30vw' : '80vw',
                    height: imageError ? 'auto' : '80vh', // Set to auto when the image fails to load
                    p: 2,
                    borderRadius: 2,
                }}
            >
                {selectedImage && (
                    <>
                        <Typography id="modal-title" variant="h4" component="h2" align="center" gutterBottom>
                            {selectedImage.title || 'Image Preview'}
                        </Typography>

                        {!imageError ? (
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
                                    onError={handleImageError} // Add error handler
                                />
                            </Box>
                        ) : (
                            <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 2 }}>
                                Image not available
                            </Typography>
                        )}
                    </>
                )}
            </Box>
        </Modal>
    );
};

export default ZoomPictureModal;
