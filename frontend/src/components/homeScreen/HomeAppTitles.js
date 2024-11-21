import React from 'react';
import Typography from '@mui/material/Typography';

export default function HomeAppTitles() {
    return (
        <div>
            <Typography
                component="h2"
                variant="h2"
                align="center"
                color="text.primary"
                noWrap
            >
                Medical Imaging Analysis for
            </Typography>
            <Typography
                component="h2"
                variant="h2"
                align="center"
                color="text.primary"
                noWrap
                gutterBottom
            >
                Breast Cancer Classification
            </Typography>
            <Typography component="h5" variant="h5" align="center" color="text.secondary" paragraph>
                Upload a mammography image to assess severity
            </Typography>
        </div>
    );
}
