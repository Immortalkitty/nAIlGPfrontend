import React from 'react';
import { Box, Button, Container, Stack } from '@mui/material';
import HomeAppTitles from './HomeAppTitles';

const HomeScreen = ({ handleUploadClick }) => {
    return (
        <Container disableGutters sx={{ flex: "1", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <Container sx={{ pt: 8, pb: 6 }} maxWidth="sm">
                <Box sx={{ minHeight: "300px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <HomeAppTitles />
                </Box>
                <Stack
                    sx={{ pt: 4 }}
                    direction="row"
                    spacing={2}
                    justifyContent="center"
                >
                    <Button sx={{ background: '#0CC0DF' }} variant="contained" onClick={handleUploadClick}>
                        Upload image
                    </Button>
                </Stack>
            </Container>
        </Container>
    );
}

export default HomeScreen;
