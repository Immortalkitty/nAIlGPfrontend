import { Grid } from '@mui/material';
import React from 'react';
import SingleImage from './SingleImage';

const ResultsGallery = (props) => {
    return (
        <Grid container spacing={4} >
            {
                props.results.map((result) => (
                    <Grid item key={result.id} xs={12} sm={6} md={4}>
                        <SingleImage image={result} />
                    </Grid>
                ))
            }
        </Grid >
    );
}

export default ResultsGallery;
