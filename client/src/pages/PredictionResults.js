import React, { useState, useRef, useEffect } from 'react';
import PredictionComponent from '../components/PredictionComponent';
import { Container } from '@mui/material';
import { uploadAndPredictImage } from '../utils/uploadAndPredict';
import { useLocation, useNavigate } from 'react-router-dom';

const PredictionResults = () => {
    const [results, setResults] = useState([]);
    const [image, setImage] = useState(null);
    const [error, setError] = useState(null);
    const isImageBeingProcessed = useRef(true);  // Ref to track processing state
    const fileInputRef = useRef(null);
    let nextId = useRef(1);

    const location = useLocation();
    const navigate = useNavigate();
    const hasPredicted = useRef(false);

    useEffect(() => {
        if (!hasPredicted.current && location.state && location.state.file) {
            handleFileChange({ target: { files: [location.state.file] } });
            hasPredicted.current = true;
        } else if (!location.state || !location.state.file) {
            navigate('/');
        }
    }, [location, navigate]);

   const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
        console.log('Processing started');
        isImageBeingProcessed.current = true;  // Start processing
        setImage(null);  // Reset the image to show spinner
        await uploadAndPredictImage(file, setImage, setError, setResults, nextId.current);
        console.log('Processing ended');
        isImageBeingProcessed.current = false;  // End processing
    }
};


    return (
        <Container disableGutters sx={{ flex: "1", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <PredictionComponent
                image={image}
                results={results}
                error={error}
                isImageBeingProcessed={isImageBeingProcessed.current}
                handleUploadNextClick={handleFileChange}
                fileInputRef={fileInputRef}
            />
        </Container>
    );
}

export default PredictionResults;
