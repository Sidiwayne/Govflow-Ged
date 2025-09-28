import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  CloudUpload,
  Close,
  AttachFile,
  Description,
  Delete,
  Add,
} from '@mui/icons-material';
import { DataDocument } from '../types/courrier';

interface AddDocumentDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (documents: (DataDocument & { size?: number })[]) => void;
}

const AddDocumentDialog: React.FC<AddDocumentDialogProps> = ({
  open,
  onClose,
  onSubmit
}) => {
  const [newDocuments, setNewDocuments] = useState<(DataDocument & { size?: number })[]>([]);
  const [fileInputRef, setFileInputRef] = useState<HTMLInputElement | null>(null);

  const handleClose = () => {
    setNewDocuments([]);
    onClose();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const uploadedDocuments: (DataDocument & { size?: number })[] = Array.from(files).map((file, index) => ({
        id: `new-${Date.now()}-${index}`,
        filename: file.name,
        url: URL.createObjectURL(file),
        type: file.type,
        size: file.size
      }));

      setNewDocuments(prev => [...prev, ...uploadedDocuments]);
    }
    // Reset the input
    if (fileInputRef) {
      fileInputRef.value = '';
    }
  };

  const handleRemoveDocument = (index: number) => {
    setNewDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const handleFileClick = () => {
    fileInputRef?.click();
  };

  const handleSubmit = () => {
    onSubmit(newDocuments);
    handleClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        borderBottom: '1px solid #e0e0e0',
        pb: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CloudUpload color="primary" />
          <Typography variant="h6">Ajouter des Documents au Dossier</Typography>
        </Box>
        <IconButton onClick={handleClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Sélection de fichiers */}
          <Grid size={12}>
            <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AttachFile color="primary" />
              Sélectionner des fichiers
            </Typography>
            
            <Button
              variant="outlined"
              fullWidth
              startIcon={<Add />}
              onClick={handleFileClick}
              sx={{ 
                py: 2,
                borderStyle: 'dashed',
                borderWidth: 2,
                '&:hover': {
                  borderStyle: 'dashed',
                  borderWidth: 2,
                }
              }}
            >
              Cliquez pour sélectionner des fichiers
            </Button>

            {/* Input file caché */}
            <input
              type="file"
              ref={setFileInputRef}
              onChange={handleFileUpload}
              multiple
              style={{ display: 'none' }}
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
            />

            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Formats acceptés: PDF, DOC, DOCX, TXT, JPG, JPEG, PNG
            </Typography>
          </Grid>

          {/* Liste des fichiers sélectionnés */}
          {newDocuments.length > 0 && (
            <Grid size={12}>
              <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Description color="primary" />
                Fichiers sélectionnés ({newDocuments.length})
              </Typography>
              
              <Paper sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
                <List dense>
                  {newDocuments.map((doc, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <Description sx={{ mr: 2, color: 'text.secondary' }} />
                      <ListItemText
                        primary={doc.filename}
                        secondary={doc.size ? `${(doc.size / 1024 / 1024).toFixed(2)} MB` : 'Taille inconnue'}
                      />
                      <ListItemSecondaryAction>
                        <IconButton 
                          edge="end" 
                          onClick={() => handleRemoveDocument(index)}
                          size="small"
                        >
                          <Delete />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          )}

          {/* Message si aucun fichier */}
          {newDocuments.length === 0 && (
            <Grid size={12}>
              <Paper sx={{ p: 3, textAlign: 'center', backgroundColor: '#fafafa' }}>
                <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Aucun fichier sélectionné
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Cliquez sur le bouton ci-dessus pour sélectionner des fichiers
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: '1px solid #e0e0e0' }}>
        <Button onClick={handleClose} color="inherit">
          Annuler
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          startIcon={<CloudUpload />}
          disabled={newDocuments.length === 0}
        >
          Ajouter au Dossier ({newDocuments.length})
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddDocumentDialog;
