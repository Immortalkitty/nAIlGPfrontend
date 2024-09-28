import React, { useState, useRef, useEffect } from 'react';
import PredictionComponent from '../components/predictionResults/PredictionComponent';
import { Container, Fab } from '@mui/material';
import { KeyboardArrowUp } from '@mui/icons-material';
import { uploadAndPredictImage } from '../utils/uploadAndPredict';
import { useLocation, useNavigate } from 'react-router-dom';

const PredictionResults = () => {
    const [results, setResults] = useState([]);
    const [image, setImage] = useState(null);
    const [error, setError] = useState(null);
    const [showScroll, setShowScroll] = useState(false);
    const isImageBeingProcessed = useRef(false);
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

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file && !isImageBeingProcessed.current) {
            isImageBeingProcessed.current = true;
            setImage(null);
            setError(null);

            try {
                await uploadAndPredictImage(file, setImage, setError, (newResults) => {
                    setResults((prevResults) => [...prevResults, ...newResults]);
                    nextId.current++;
                });

                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            } catch (err) {
                setError('error processing the image');
            } finally {
                isImageBeingProcessed.current = false;
            }
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
