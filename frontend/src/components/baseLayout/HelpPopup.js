import React from 'react';
import { Box, Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import helpPopupContent from './content';

const HelpPopup = ({ open, onClose }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
            PaperProps={{
                sx: {
                    backgroundColor: 'rgb(12,192,223)',
                    borderRadius: 2,
                    p: 2,
                    width: '80%',
                },
            }}
        >
            <DialogTitle sx={{ color: 'white' }}>
                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                    {helpPopupContent.title}
                </Typography>
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
                <Typography variant="h6" gutterBottom sx={{ color: 'white',fontWeight: 'bold' }}>
                    {helpPopupContent.description}
                </Typography>
                {helpPopupContent.manual.map((step, index) => (
                    <Box key={index} sx={{ mt: 2 }}>
                        <Typography variant="h6" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>
                            {step.title}
                        </Typography>
                        {step.content.map((line, idx) => (
                            <Typography key={idx} variant="body2" gutterBottom sx={{ color: 'white' }}>
                                {line}
                            </Typography>
                        ))}
                    </Box>
                ))}
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    {helpPopupContent.examples.map((example, index) => (
                        <Box key={index} sx={{ mx: 2, textAlign: 'center' }}>
                            <Box
                                component="img"
                                src={example.imgSrc}
                                alt={example.label}
                                sx={{ maxWidth: '150px', maxHeight: '150px', width: 'auto', height: 'auto' }}
                            />
                            <Typography variant="h6" align="center" sx={{ color: 'white' }}>
                                {example.label}
                            </Typography>
                        </Box>
                    ))}
                </Box>
                <Typography variant="h6" gutterBottom sx={{ mt: 3 ,color: 'white',fontWeight: 'bold' }}>
                    Notes
                </Typography>
                {helpPopupContent.notes.map((note, index) => (
                    <Typography key={index} variant="body2" gutterBottom sx={{ color: 'white' }}>
                        {note}
                    </Typography>
                ))}
            </DialogContent>
        </Dialog>
    );
};

export default HelpPopup;
