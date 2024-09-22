import React, { useState } from 'react';
import { Grid } from '@mui/material';
import SingleImage from './SingleImage';
import ZoomPictureModal from './ZoomPictureModal';

const ResultsGallery = ({ results }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [willChangeImage, setWillChangeImage] = useState(null); // Track the image to apply will-change

    const handleImageClick = (image) => {
        setSelectedImage(image);
        setWillChangeImage(image.id);  // Apply will-change dynamically
    };

    const handleClose = () => {
        setSelectedImage(null);
        setWillChangeImage(null);  // Remove will-change after the action is completed
    };

    // Determine if the selected image has a valid src
    const isImageValid = selectedImage && selectedImage.src;

    return (
        <>
            <Grid container spacing={4}>
                {results && results.length > 0 ? (
                    results.map((result, index) => (
                        <Grid
                            item
                            key={result.id || `${index}-${Date.now()}`}
                            xs={12}
                            sm={6}
                            md={4}
                            style={willChangeImage === result.id ? { willChange: 'transform, opacity' } : {}}
                        >
                            <SingleImage image={result} onClick={() => handleImageClick(result)} />
                        </Grid>
                    ))
                ) : (
                    <Grid item xs={12}>
                        <p>No results available.</p>
                    </Grid>
                )}
            </Grid>

            {selectedImage && (
                <ZoomPictureModal
                    selectedImage={selectedImage}
                    handleClose={handleClose}
                    isImageValid={isImageValid} // Pass image validity status to the modal
                />
            )}
        </>
    );
};

export default ResultsGallery;
