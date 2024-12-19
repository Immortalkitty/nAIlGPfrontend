import React from 'react';
import { Box, Dialog, DialogContent, DialogTitle, IconButton, Typography, List, ListItem, ListItemText, Divider, Grid } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import helpPopupContent from './content';

const HelpPopup = ({ open, onClose }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: 2,
                    p: 2,
                },
            }}
        >
            <DialogTitle>
                <Typography variant="h5" fontWeight="fontWeightBold">
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
                {/* Description */}
                <Typography variant="body1" gutterBottom>
                    {helpPopupContent.description}
                </Typography>

                {/* Manual Instructions */}
                <Typography variant="h6" sx={{ fontWeight: 'bold' }} gutterBottom>
                    Instructions:
                </Typography>
                {helpPopupContent.manual.map((step, index) => (
                    <Box key={index} mb={2}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }} gutterBottom>
                            {step.title}
                        </Typography>
                        <List>
                            {step.content.map((item, subIndex) => (
                                <ListItem key={subIndex}>
                                    <ListItemText primary={item} />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                ))}

                {/* Notes */}
                <Typography variant="h6" sx={{ fontWeight: 'bold' }} gutterBottom>
                    Notes:
                </Typography>
                <List>
                    {helpPopupContent.notes.map((note, index) => (
                        <ListItem key={index}>
                            <ListItemText primary={note} />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
        </Dialog>
    );
};

export default HelpPopup;
