import { CardContent, Typography, Card, CardMedia, LinearProgress, Box, Tooltip } from '@mui/material';
import React, { useState, useEffect } from 'react';

const SingleImage = ({ image, onClick }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setProgress((image.confidence || 0) * 100);
        }, 300);

        return () => clearTimeout(timer);
    }, [image]);

    if (!image || !image.src) {
        return null;
    }

    const formattedConfidence = (progress).toFixed(2) + "%";

    const getProgressBarColor = (title) => {
        if (!title) return 'primary';
        return title.toLowerCase().includes('infected') ? 'error' : 'success';
    };

    return (
        <Card
            sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: "opacity 500ms ease-in-out", cursor: 'pointer' }}
            onClick={() => onClick(image)}
        >
            <CardMedia
                sx={{ maxHeight: "500px", objectFit: "cover" }}
                component="img"
                image={image.src}
                alt={image.title || 'Image preview'}
            />
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                    {image.title}
                </Typography>

                <Box sx={{ width: '100%', mt: 1 }}>
                    <Typography variant="body2" color="textSecondary" sx={{ fontSize: '1.1rem' }}>
                        Confidence:
                    </Typography>
                    <Tooltip
                        title={<Typography sx={{ fontSize: '1.25rem' }}>{formattedConfidence}</Typography>}
                        arrow
                    >
                        <LinearProgress
                            variant="determinate"
                            value={progress}
                            sx={{
                                height: 10,
                                borderRadius: 5,
                                transition: 'width 1s ease, background-color 1s ease',
                            }}
                            color={getProgressBarColor(image.title)}
                        />
                    </Tooltip>
                </Box>
            </CardContent>
        </Card>
    );
};

export default SingleImage;
