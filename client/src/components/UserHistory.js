import React, { useEffect, useState, useRef } from 'react';
import { Box, Container, Paper, Typography, Button, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import axios from 'axios';
import ResultsGallery from './ResultsGallery';

const UserHistory = ({ isLoggedIn, username }) => {
    const [results, setResults] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const isFetching = useRef(false);

    useEffect(() => {
        if (isLoggedIn && !isFetching.current) {
            setResults([]);
            setPage(1);
            setHasMore(true);
            fetchPredictions(1);
        }
    }, [isLoggedIn]);

    const fetchPredictions = async (pageNumber) => {
        if (isFetching.current || !hasMore) return;
        isFetching.current = true;

        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:5000/predictions/user-predictions?page=${pageNumber}&limit=10`, { withCredentials: true });
            const predictions = response.data.predictions.map(prediction => ({
                src: prediction.image_src,
                title: prediction.title,
                confidence: prediction.confidence,
                id: prediction.id
            }));
            setResults(prevResults => [...prevResults, ...predictions]);
            setHasMore(response.data.has_more);
            setPage(pageNumber);
        } catch (error) {
            console.error('Error fetching predictions:', error.response ? error.response.data : error.message);
        } finally {
            setLoading(false);
            isFetching.current = false;
        }
    };

    const handleLoadMore = () => {
        if (hasMore && !isFetching.current) {
            fetchPredictions(page + 1);
        }
    };

    return (
        <Container maxWidth="lg">
            <motion.div
                key="user-history"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
                exit={{ opacity: 0, y: -20, transition: { duration: 0.5 } }}
            >
                <Box sx={{ padding: 1 }}>
                    <Typography variant="h4" align="center" sx={{ marginBottom: 1, marginTop: 3 }}>
                        Welcome, {username}!
                    </Typography>
                    <Typography sx={{ marginBottom: 6 }} align="center" variant="h4" component="h3">
                        Your Previous Predictions:
                    </Typography>
                    <Paper elevation={3} sx={{ p: 4, background: '#0CC0DF' }}>
                        <ResultsGallery results={results} />
                        {loading && <CircularProgress />}
                        {hasMore && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                <Button onClick={handleLoadMore} variant="contained" sx={{ background: '#0CC0DF' }}>
                                    Load More
                                </Button>
                            </Box>
                        )}
                    </Paper>
                </Box>
            </motion.div>
        </Container>
    );
};

export default UserHistory;
