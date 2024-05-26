import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const HelpPopup = ({ open, onClose }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent background
                    borderRadius: 2,
                    p: 2,
                },
            }}
        >
            <DialogTitle>
                How to use?
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <Typography gutterBottom>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Box sx={{ mx: 2, textAlign: 'center' }}>
                        <img src="example1.png" alt="example1" style={{ width: 100, height: 100 }} />
                        <Typography variant="h6">Correct</Typography>
                    </Box>
                    <Box sx={{ mx: 2, textAlign: 'center' }}>
                        <img src="example2.png" alt="example2" style={{ width: 100, height: 100 }} />
                        <Typography variant="h6">Incorrect</Typography>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default HelpPopup;
