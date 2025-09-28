import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Grid,
  Paper,
  Chip,
  Button,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  Autocomplete,
  CircularProgress,
} from '@mui/material';
import {
  Send,
  Close,
  Person,
  Description,
  PriorityHigh as Priority,
  AttachFile,
  Delete,
  Add,
} from '@mui/icons-material';
import { DataDocument } from '../types/courrier';
import { transmitCourrier } from '../store/slices/courrier/thunks';
import { selectAllEntities } from '../store/slices/entity';

interface TransmitDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TransmitData) => void;
  documents: DataDocument[];
  courrierId: string;
  nodeId: string;
}

interface TransmitData {
  recipients: Array<{ entity: string; user: string; userId: string; entityId: string }>;
  message: string;
  priority: string;
  confidentialite: string;
  additionalDocuments: DataDocument[];
}


const TransmitDialog: React.FC<TransmitDialogProps> = ({
  open,
  onClose,
  onSubmit,
  documents,
  courrierId,
  nodeId
}) => {
  const dispatch = useDispatch<any>();
  const entities = useSelector(selectAllEntities);
  const [transmitData, setTransmitData] = useState<TransmitData>({
    recipients: [],
    message: '',
    priority: 'normale',
    confidentialite: 'interne',
    additionalDocuments: []
  });
  const [selectedEntities, setSelectedEntities] = useState<any[]>([]);
  const [fileInputRef, setFileInputRef] = useState<HTMLInputElement | null>(null);
  const [isTransmitting, setIsTransmitting] = useState(false);

  const handleClose = () => {
    setTransmitData({
      recipients: [],
      message: '',
      priority: 'normale',
      confidentialite: 'interne',
      additionalDocuments: []
    });
    setSelectedEntities([]);
    onClose();
  };

  // Fonction pour formater le nom de l'utilisateur (première lettre du prénom + nom)
  const formatUserName = (firstname: string | undefined, lastname: string | undefined) => {
    if (!firstname || !lastname) return 'N/A';
    return `${firstname.charAt(0)}. ${lastname}`;
  };

  // Fonction pour obtenir le nom complet
  const getFullName = (firstname: string | undefined, lastname: string | undefined) => {
    if (!firstname || !lastname) return 'Utilisateur non assigné';
    return `${firstname} ${lastname}`;
  };

  const handleEntitySelectionChange = (newSelectedEntities: any[]) => {
    setSelectedEntities(newSelectedEntities);
    
    // Mettre à jour les destinataires avec l'utilisateur principal de chaque entité
    const newRecipients = newSelectedEntities.map(entity => ({
      entity: entity.name,
      user: getFullName(entity.main_user?.firstname, entity.main_user?.lastname),
      userId: entity.main_user?.id || '',
      entityId: entity.id
    }));
    
    setTransmitData(prev => ({
      ...prev,
      recipients: newRecipients
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newDocuments: DataDocument[] = Array.from(files).map((file, index) => ({
        id: `additional-${Date.now()}-${index}`,
        filename: file.name,
        url: URL.createObjectURL(file),
        size: file.size,
        type: file.type
      }));

      setTransmitData(prev => ({
        ...prev,
        additionalDocuments: [...prev.additionalDocuments, ...newDocuments]
      }));
    }
    // Reset the input
    if (fileInputRef) {
      fileInputRef.value = '';
    }
  };

  const handleRemoveAdditionalDocument = (index: number) => {
    setTransmitData(prev => ({
      ...prev,
      additionalDocuments: prev.additionalDocuments.filter((_, i) => i !== index)
    }));
  };

  const handleAddDocumentClick = () => {
    fileInputRef?.click();
  };

  const handleSubmit = async () => {
    if (transmitData.recipients.length === 0) return;
    
    setIsTransmitting(true);
    
    try {
      // Dispatch l'action de transmission
      await dispatch(transmitCourrier({
        courierId: courrierId,
        nodeId,
        recipients: transmitData.recipients,
        message: transmitData.message,
        priority: transmitData.priority,
        confidentialite: transmitData.confidentialite,
        additionalDocuments: transmitData.additionalDocuments,
      })).unwrap();
      
      // Appeler le callback de succès
      onSubmit(transmitData);
      handleClose();
    } catch (error) {
      console.error('Erreur lors de la transmission:', error);
      // Ici on pourrait afficher une notification d'erreur
    } finally {
      setIsTransmitting(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: '600px' }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        borderBottom: '1px solid #e0e0e0',
        pb: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Send color="primary" />
          <Typography variant="h6">Transmettre le Courrier</Typography>
        </Box>
        <IconButton onClick={handleClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Destinataires */}
          <Grid size={12}>
            <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Person color="primary" />
              Destinataires
            </Typography>
            
            {/* Sélection multiple des entités */}
            <Autocomplete
              multiple
              options={entities.filter(entity => entity.is_active && entity.main_user)}
              value={selectedEntities}
              onChange={(event, newValue) => {
                handleEntitySelectionChange(newValue);
              }}
              getOptionLabel={(option) => `${option.name} (${formatUserName(option.main_user?.firstname, option.main_user?.lastname)})`}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Sélectionner les entités"
                  placeholder="Tapez pour rechercher..."
                  size="small"
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option.id}
                    label={`${option.name} (${formatUserName(option.main_user?.firstname, option.main_user?.lastname)})`}
                    onDelete={() => {
                      const newSelected = selectedEntities.filter((_, i) => i !== index);
                      handleEntitySelectionChange(newSelected);
                    }}
                    sx={{
                      '&:hover': {
                        '& .MuiChip-deleteIcon': {
                          opacity: 1,
                        }
                      }
                    }}
                  />
                ))
              }
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                    <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main', fontSize: '0.75rem' }}>
                      {option.main_user?.firstname?.charAt(0) || '?'}
                    </Avatar>
                    <Box>
                      <Typography variant="body2">
                        {option.name}
                      </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatUserName(option.main_user?.firstname, option.main_user?.lastname)} - {option.main_user?.email || 'Email non disponible'}
                        </Typography>
                    </Box>
                  </Box>
                </Box>
              )}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              sx={{ mb: 2 }}
            />
          </Grid>

          {/* Message */}
          <Grid size={12}>
            <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Description color="primary" />
              Message
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Ajoutez un message d'accompagnement..."
              value={transmitData.message}
              onChange={(e) => setTransmitData(prev => ({ ...prev, message: e.target.value }))}
              variant="outlined"
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#fafafa'
                }
              }}
            />
          </Grid>

          {/* Options */}
          <Grid size={12}>
            <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Priority color="primary" />
              Options
            </Typography>
            <Grid container spacing={2}>
              <Grid size={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Priorité</InputLabel>
                  <Select
                    value={transmitData.priority}
                    label="Priorité"
                    onChange={(e) => setTransmitData(prev => ({ ...prev, priority: e.target.value }))}
                  >
                    <MenuItem value="basse">Basse</MenuItem>
                    <MenuItem value="normale">Normale</MenuItem>
                    <MenuItem value="haute">Haute</MenuItem>
                    <MenuItem value="urgente">Urgente</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Confidentialité</InputLabel>
                  <Select
                    value={transmitData.confidentialite}
                    label="Confidentialité"
                    onChange={(e) => setTransmitData(prev => ({ ...prev, confidentialite: e.target.value }))}
                  >
                    <MenuItem value="interne">Interne</MenuItem>
                    <MenuItem value="confidentiel">Confidentiel</MenuItem>
                    <MenuItem value="secret">Secret</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>

          {/* Documents joints */}
          <Grid size={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AttachFile color="primary" />
                Documents joints
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<Add />}
                onClick={handleAddDocumentClick}
              >
                Ajouter des documents
              </Button>
            </Box>

            {/* Input file caché */}
            <input
              type="file"
              ref={setFileInputRef}
              onChange={handleFileUpload}
              multiple
              style={{ display: 'none' }}
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
            />

            {/* Documents existants du courrier */}
            {documents && documents.length > 0 && (
              <Paper sx={{ p: 2, mb: 2, backgroundColor: '#f5f5f5' }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Documents du courrier ({documents.length})
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {documents.map((doc, index) => (
                    <Chip
                      key={`existing-${index}`}
                      label={doc.filename}
                      size="small"
                      icon={<AttachFile />}
                      variant="outlined"
                      color="primary"
                    />
                  ))}
                </Box>
              </Paper>
            )}

            {/* Documents supplémentaires ajoutés */}
            {transmitData.additionalDocuments.length > 0 && (
              <Paper sx={{ p: 2, backgroundColor: '#e3f2fd' }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Documents supplémentaires ({transmitData.additionalDocuments.length})
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {transmitData.additionalDocuments.map((doc, index) => (
                    <Chip
                      key={`additional-${index}`}
                      label={doc.filename}
                      size="small"
                      icon={<AttachFile />}
                      variant="outlined"
                      color="secondary"
                      onDelete={() => handleRemoveAdditionalDocument(index)}
                      deleteIcon={<Delete />}
                    />
                  ))}
                </Box>
              </Paper>
            )}

            {/* Message si aucun document */}
            {(!documents || documents.length === 0) && transmitData.additionalDocuments.length === 0 && (
              <Paper sx={{ p: 3, textAlign: 'center', backgroundColor: '#fafafa' }}>
                <AttachFile sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Aucun document joint
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Cliquez sur "Ajouter des documents" pour joindre des fichiers
                </Typography>
              </Paper>
            )}
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: '1px solid #e0e0e0' }}>
        <Button onClick={handleClose} color="inherit">
          Annuler
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          startIcon={isTransmitting ? <CircularProgress size={20} /> : <Send />}
          disabled={transmitData.recipients.length === 0 || isTransmitting}
        >
          {isTransmitting ? 'Transmission...' : `Transmettre (${transmitData.recipients.length}) - ${(documents?.length || 0) + transmitData.additionalDocuments.length} docs`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TransmitDialog;
