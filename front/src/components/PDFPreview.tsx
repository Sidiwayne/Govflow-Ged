import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import {
  Close,
  ZoomIn,
  ZoomOut,
  Download,
} from '@mui/icons-material';
import { DataDocument } from '../types/courrier';

interface PDFPreviewProps {
  open: boolean;
  onClose: () => void;
  file: DataDocument | null;
}

const PDFPreview: React.FC<PDFPreviewProps> = ({ open, onClose, file }) => {
  const [scale, setScale] = useState(1);

  if (!file) return null;


  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { height: '90vh' }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          Prévisualisation - {file.filename}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={handleZoomOut} size="small">
            <ZoomOut />
          </IconButton>
          <Typography variant="body2" sx={{ minWidth: 60, textAlign: 'center' }}>
            {Math.round(scale * 100)}%
          </Typography>
          <IconButton onClick={handleZoomIn} size="small">
            <ZoomIn />
          </IconButton>
          <IconButton onClick={handleDownload} size="small">
            <Download />
          </IconButton>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ p: 0, overflow: 'hidden' }}>
        <Box
          sx={{
            width: '100%',
            height: '100%',
            overflow: 'auto',
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: '#f5f5f5',
          }}
        >
          {file.type === 'application/pdf' ? (
            <iframe
              src={`${file.url}#toolbar=0&navpanes=0&scrollbar=0`}
              style={{
                width: `${100 * scale}%`,
                height: '100%',
                border: 'none',
              }}
              title="PDF Preview"
            />
          ) : (
            <img
              src={file.url}
              alt="Document preview"
              style={{
                maxWidth: `${100 * scale}%`,
                maxHeight: '100%',
                objectFit: 'contain',
              }}
            />
          )}
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>Fermer</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PDFPreview;
