import React, { useState, useRef, useEffect } from 'react';
import PredictionComponent from '../components/PredictionComponent';
import { Container, Fab } from '@mui/material';
import { KeyboardArrowUp } from '@mui/icons-material';
import { uploadAndPredictImage } from '../utils/uploadAndPredict';
import { useLocation, useNavigate } from 'react-router-dom';

const PredictionResults = () => {
    const [results, setResults] = useState([]);
    const [image, setImage] = useState(null);
    const [error, setError] = useState(null);
    const [showScroll, setShowScroll] = useState(false);  // State to track scroll position
    const isImageBeingProcessed = useRef(false);  // Ref to track processing state (initialize as false)
    const fileInputRef = useRef(null);
    let nextId = useRef(1);  // For tracking next result ID

    const location = useLocation();
    const navigate = useNavigate();
    const hasPredicted = useRef(false);  // Ref to ensure prediction only happens once

    useEffect(() => {
        // Process file if it exists in the location state and the prediction hasn't been made yet
        if (!hasPredicted.current && location.state && location.state.file) {
            handleFileChange({ target: { files: [location.state.file] } });
            hasPredicted.current = true;  // Set as predicted to prevent multiple triggers
        } else if (!location.state || !location.state.file) {
            // Redirect to home if no file exists in the state
            navigate('/');
        }
    }, [location, navigate]);

    // Scroll event listener to show or hide the "Back to Top" button
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowScroll(true);
            } else {
                setShowScroll(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Function to scroll to the top of the page
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file && !isImageBeingProcessed.current) {
            console.log('Processing started');
            isImageBeingProcessed.current = true;  // Start processing
            setImage(null);  // Reset the image to show spinner
            setError(null);  // Reset error state

            try {
                // Upload and predict the image, and append the results
                await uploadAndPredictImage(file, setImage, setError, (newResults) => {
                    // Append new results to the current results
                    setResults((prevResults) => [...prevResults, ...newResults]);
                }, nextId.current);
                console.log('Processing ended');
            } catch (err) {
                console.error('Error processing image:', err);
                setError('Error processing the image');
            } finally {
                isImageBeingProcessed.current = false;  // End processing
            }
        }
    };

    return (
        <Container disableGutters sx={{ flex: "1", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <PredictionComponent
                image={image}
                results={results}  // Pass the results to the component
                error={error}
                isImageBeingProcessed={isImageBeingProcessed.current}
                handleUploadNextClick={handleFileChange}
                fileInputRef={fileInputRef}
            />

            {/* Back to Top Button */}
            {showScroll && (
                <Fab
                    color="primary"
                    size="small"
                    onClick={scrollToTop}
                    sx={{ position: 'fixed', bottom: 16, right: 16 }}
                >
                    <KeyboardArrowUp />
                </Fab>
            )}
        </Container>
    );
}

export default PredictionResults;
