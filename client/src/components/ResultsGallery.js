import { Grid } from '@mui/material';
import React from 'react';
import SingleImage from './SingleImage';

const ResultsGallery = ({ results }) => {
    console.log("Results passed to ResultsGallery:", results);
    return (
        <Grid container spacing={4}>
            {
                results && results.length > 0 ? (
                    results.map((result) => (
                        <Grid item key={result.id} xs={12} sm={6} md={4}>
                            <SingleImage image={result} />
                        </Grid>
                    ))
                ) : (
                    <Grid item xs={12}>
                        <p>No results available.</p>
                    </Grid>
                )
            }
        </Grid>
    );
}

export default ResultsGallery;
