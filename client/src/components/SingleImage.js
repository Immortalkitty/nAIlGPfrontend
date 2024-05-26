import { CardContent, Typography, Card, CardMedia } from '@mui/material';
import React, { useEffect } from 'react';

const SingleImage = ({ image }) => {
    useEffect(() => {
        console.log(image);
    }, [image]);

    if (!image || !image.src) {
        return null; // Handle missing image data
    }

    const formattedConfidence = (image.confidence * 100).toFixed(2) + "%";

    return (
        <Card
            sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: "opacity 500ms ease-in-out" }}
        >
            <CardMedia
                sx={{ maxHeight: "500px" }}
                component="img"
                image={image.src}
                alt={image.title}
            />
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                    {image.title}
                </Typography>
                <div style={{ display: "flex" }}>
                    <Typography noWrap>
                        Confidence:
                    </Typography>
                    <Typography noWrap color={image.confidence >= 0.5 ? "success.main" : "error.main"}>
                        {" " + formattedConfidence}
                    </Typography>
                </div>
            </CardContent>
        </Card>
    );
}

export default SingleImage;
