import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  IconButton,
  Grid,
  Paper,
  Divider,
  FormControlLabel,
  Checkbox,
  Alert,
  Snackbar,
  Autocomplete,
  Stack,
} from '@mui/material';
import {
  CloudUpload,
  Delete,
  Save,
  Send,
  Cancel,
  Description,
  Person,
  Schedule,
  PriorityHigh,
  Security,
  Label,
  AccountTree,
  Visibility,
  Add,
} from '@mui/icons-material';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import PDFPreview from '../components/PDFPreview';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectActiveEntities } from '../store/slices/entity';
import { fetchEntities } from '../store/slices/entity/thunks';
import { createCourrier } from '../store/slices/courrier/thunks';
import { CourrierFlow, DataDocument } from '../types/courrier';
import { useNavigate } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';

interface CourrierForm {
  type: string;
  canalReception: string;
  expediteur: string;
  objet: string;
  referenceExterne: string;
  dateReception: any; // dayjs object
  priorite: string;
  confidentialite: string;
  tags: string[];
  workflow: string;
  noteInitiale: string;
  destinations: Array<{
    entity: string;
    userId: string;
  }>;
  demanderAccuse: boolean;
}

const NouveauCourrier: React.FC = () => {
  const dispatch = useAppDispatch();
  const entities = useAppSelector(selectActiveEntities);
  const user = useAppSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [action, setAction] = useState<React.ReactNode | null>(null);
  
  const [formData, setFormData] = useState<CourrierForm>({
    type: '',
    canalReception: '',
    expediteur: '',
    objet: '',
    referenceExterne: '',
    dateReception: dayjs(),
    priorite: 'normale',
    confidentialite: 'publique',
    tags: [],
    workflow: '',
    noteInitiale: '',
    destinations: [],
    demanderAccuse: false,
  });


  const [uploadedFiles, setUploadedFiles] = useState<DataDocument[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [previewFile, setPreviewFile] = useState<DataDocument  | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Données de démonstration
  const typesCourrier = ['Lettre', 'Note', 'Rapport', 'Décret', 'Arrêté', 'Circulaire', 'Autre'];
  const canauxReception = ['Physique', 'Email', 'Portail', 'Fax', 'Autre'];
  const priorites = ['normale', 'haute', 'urgente'];
  const confidentialites = ['publique', 'interne', 'confidentiel', 'secret'];
  const workflows = ['Traitement Standard', 'Traitement Urgent', 'Validation Hiérarchique', 'Circuit Personnalisé'];
  const tagsSuggerees = ['Finances', 'Ressources Humaines', 'Défense', 'Infrastructure', 'Santé', 'Éducation', 'Agriculture', 'Commerce'];

  const handleInputChange = (field: keyof CourrierForm, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = useCallback((files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files).filter(file => 
        file.type === 'application/pdf' || file.type.startsWith('image/')
      ).map(file => ({
        id: file.name,
        filename: file.name,
        url: URL.createObjectURL(file),
        type: file.type,
      }));
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFileUpload(e.dataTransfer.files);
  }, [handleFileUpload]);

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const _previewFile = (file: DataDocument) => {
    setPreviewFile(file);
    setPreviewOpen(true);
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      handleInputChange('tags', [...formData.tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    handleInputChange('tags', formData.tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (action: 'draft' | 'submit') => {
    // Validation basique
    if (!formData.type || !formData.expediteur || !formData.objet || !formData.dateReception || formData.destinations.length === 0) {
      setSnackbar({ open: true, message: 'Veuillez remplir tous les champs obligatoires', severity: 'error' });
      return;
    }

    if (uploadedFiles.length === 0) {
      setSnackbar({ open: true, message: 'Veuillez ajouter au moins un document', severity: 'error' });
      return;
    }

    setIsSubmitting(true);

    try {
      const courrierData = {
        flow: CourrierFlow.ENTRANT,
        type: formData.type,
        metadata: {
          expediteur: formData.expediteur,
          objet: formData.objet,
          priorite: formData.priorite as 'haute' | 'normale' | 'basse',
          dateReception: formData.dateReception.toISOString(),
          referenceExterne: formData.referenceExterne,
          confidentialite: formData.confidentialite,
          tags: formData.tags,
          noteInitiale: formData.noteInitiale,
        },
        initialEntity: user?.entity?.id || '',
        initialUserId: user?.id || '',
        destinations: formData.destinations.map(dest => ({
          entity: dest.entity,
          userId: dest.userId,
        })),
        documents: uploadedFiles,
      };

      await dispatch(createCourrier(courrierData)).unwrap();

      const message = action === 'draft' ? 'Courrier enregistré comme brouillon' : 'Courrier soumis au traitement';
      setAction(<Button variant="outlined" onClick={() => navigate('/courriers/entrants')}>Voir</Button>);
      setSnackbar({ open: true, message, severity: 'success' });
      setTimeout(() => {
        setAction(null);
      }, 7000);
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          type: '',
          canalReception: '',
          expediteur: '',
          objet: '',
          referenceExterne: '',
          dateReception: dayjs(),
          priorite: 'normale',
          confidentialite: 'publique',
          tags: [],
          workflow: '',
          noteInitiale: '',
          destinations: [],
          demanderAccuse: false,
        });
        setUploadedFiles([]);
      }, 2000);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Erreur lors de la création du courrier',
        severity: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', mb: 3 }}>
          Nouveau Courrier Entrant
        </Typography>

        <Grid container spacing={3}>
          {/* Colonne gauche - Métadonnées */}
          <Grid size={{xs: 12, md: 8}}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Description color="primary" />
                  Métadonnées du Courrier
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={2}>
                  <Grid size={{xs: 12, sm: 6}}>
                    <FormControl fullWidth required>
                      <InputLabel>Type de courrier</InputLabel>
                      <Select
                        value={formData.type}
                        label="Type de courrier"
                        onChange={(e) => handleInputChange('type', e.target.value)}
                      >
                        {typesCourrier.map(type => (
                          <MenuItem key={type} value={type}>{type}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid size={{xs: 12, sm: 6}}>
                    <FormControl fullWidth required>
                      <InputLabel>Canal de réception</InputLabel>
                      <Select
                        value={formData.canalReception}
                        label="Canal de réception"
                        onChange={(e) => handleInputChange('canalReception', e.target.value)}
                      >
                        {canauxReception.map(canal => (
                          <MenuItem key={canal} value={canal}>{canal}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid size={{xs: 12}}>
                    <Autocomplete
                      freeSolo
                      options={['Ministère de l\'Intérieur', 'Cour Suprême', 'Assemblée Nationale']}
                      value={formData.expediteur}
                      onChange={(_, value) => handleInputChange('expediteur', value || '')}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Expéditeur"
                          required
                          fullWidth
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />,
                          }}
                        />
                      )}
                    />
                  </Grid>

                  <Grid size={{xs: 12}}>
                    <TextField
                      label="Objet"
                      value={formData.objet}
                      onChange={(e) => handleInputChange('objet', e.target.value)}
                      required
                      fullWidth
                      multiline
                      rows={2}
                    />
                  </Grid>

                  <Grid size={{xs: 12, sm: 6}}>
                    <TextField
                      label="Référence externe (optionnel)"
                      value={formData.referenceExterne}
                      onChange={(e) => handleInputChange('referenceExterne', e.target.value)}
                      fullWidth
                    />
                  </Grid>

                  <Grid size={{xs: 12, sm: 6}}>
                    <DatePicker
                      label="Date de réception"
                      value={formData.dateReception}
                      onChange={(date) => handleInputChange('dateReception', date)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          required: true,
                          InputProps: {
                            startAdornment: <Schedule sx={{ mr: 1, color: 'text.secondary' }} />,
                          },
                        },
                      }}
                    />
                  </Grid>

                  <Grid size={{xs: 12, sm: 6}}>
                    <FormControl fullWidth>
                      <InputLabel>Priorité</InputLabel>
                      <Select
                        value={formData.priorite}
                        label="Priorité"
                        onChange={(e) => handleInputChange('priorite', e.target.value)}
                        startAdornment={<PriorityHigh sx={{ mr: 1, color: 'text.secondary' }} />}
                      >
                        {priorites.map(priorite => (
                          <MenuItem key={priorite} value={priorite}>
                            {priorite.charAt(0).toUpperCase() + priorite.slice(1)}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid size={{xs: 12, sm: 6}}>
                    <FormControl fullWidth>
                      <InputLabel>Confidentialité</InputLabel>
                      <Select
                        value={formData.confidentialite}
                        label="Confidentialité"
                        onChange={(e) => handleInputChange('confidentialite', e.target.value)}
                        startAdornment={<Security sx={{ mr: 1, color: 'text.secondary' }} />}
                      >
                        {confidentialites.map(conf => (
                          <MenuItem key={conf} value={conf}>
                            {conf.charAt(0).toUpperCase() + conf.slice(1)}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid size={{xs: 12}}>
                    <Typography variant="subtitle2" gutterBottom>
                      Destinations
                    </Typography>
                    <Autocomplete
                      multiple
                      options={entities}
                      getOptionLabel={(option) => `${option.name}${option.main_user ? ` (${option.main_user.firstname} ${option.main_user.lastname})` : ''}`}
                      value={formData.destinations.map(dest => 
                        entities.find(entity => entity.id === dest.entity) || 
                        { id: dest.entity, name: dest.entity, main_user: null }
                      )}
                      onChange={(_, newValue) => {
                        const newDestinations = newValue.map(entity => ({
                          entity: entity.id,
                          userId: entity.main_user?.id || '',
                        }));
                        handleInputChange('destinations', newDestinations);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Sélectionner les destinations"
                          placeholder="Rechercher et sélectionner..."
                          required
                          // error={formData.destinations.length === 0}
                          // helperText={formData.destinations.length === 0 ? "Au moins une destination est requise" : ""}
                        />
                      )}
                      renderOption={(props, option) => (
                        <li {...props}>
                          <Box>
                            <Typography variant="body1">
                              {option.name}
                            </Typography>
                            {option.main_user && (
                              <Typography variant="caption" color="text.secondary">
                                {option.main_user.firstname} {option.main_user.lastname}
                              </Typography>
                            )}
                          </Box>
                        </li>
                      )}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip
                            {...getTagProps({ index })}
                            key={option.id}
                            label={option.name}
                            variant="outlined"
                            color="primary"
                            size="small"
                          />
                        ))
                      }
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      filterOptions={(options, { inputValue }) => {
                        const searchTerm = inputValue.toLowerCase();
                        return options.filter(option =>
                          option.name.toLowerCase().includes(searchTerm) ||
                          (option.main_user && 
                           `${option.main_user.firstname} ${option.main_user.lastname}`.toLowerCase().includes(searchTerm))
                        );
                      }}
                      noOptionsText="Aucune entité trouvée"
                      loading={false}
                      loadingText="Chargement des entités..."
                      openText="Ouvrir"
                      closeText="Fermer"
                      clearText="Effacer"
                      selectOnFocus
                      clearOnBlur={false}
                      disableCloseOnSelect
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Catégorisation et Workflow */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Label color="primary" />
                  Catégorisation et Workflow
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={2}>
                  <Grid size={{xs: 12}}>
                    <Typography variant="subtitle2" gutterBottom>
                      Tags / Catégories
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      {formData.tags.map(tag => (
                        <Chip
                          key={tag}
                          label={tag}
                          onDelete={() => removeTag(tag)}
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Autocomplete
                        freeSolo
                        options={tagsSuggerees}
                        value={newTag}
                        onChange={(_, value) => setNewTag(value || '')}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Ajouter un tag"
                            size="small"
                            sx={{ minWidth: 200 }}
                          />
                        )}
                      />
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={addTag}
                        startIcon={<Add />}
                      >
                        Ajouter
                      </Button>
                    </Box>
                  </Grid>

                  <Grid size={{xs: 12}}>
                    <FormControl fullWidth>
                      <InputLabel>Circuit de traitement</InputLabel>
                      <Select
                        value={formData.workflow}
                        label="Circuit de traitement"
                        onChange={(e) => handleInputChange('workflow', e.target.value)}
                        startAdornment={<AccountTree sx={{ mr: 1, color: 'text.secondary' }} />}
                      >
                        {workflows.map(workflow => (
                          <MenuItem key={workflow} value={workflow}>{workflow}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid size={{xs: 12}}>
                    <TextField
                      label="Note ou instruction initiale"
                      value={formData.noteInitiale}
                      onChange={(e) => handleInputChange('noteInitiale', e.target.value)}
                      fullWidth
                      multiline
                      rows={3}
                      placeholder="Ex: à transmettre à la DRH pour traitement"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Colonne droite - Documents et Actions */}
          <Grid size={{xs: 12, md: 4}}>
            {/* Documents */}
            <Card sx={{ mb: 3, height: 'fit-content' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CloudUpload color="primary" />
                  Documents
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Paper
                  sx={{
                    border: '2px dashed',
                    borderColor: dragActive ? 'primary.main' : 'grey.300',
                    borderRadius: 2,
                    p: 2,
                    textAlign: 'center',
                    backgroundColor: dragActive ? 'primary.light' : 'grey.50',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    minHeight: 120,
                  }}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('file-input')?.click()}
                >
                  <CloudUpload sx={{ fontSize: 36, color: 'primary.main', mb: 1 }} />
                  <Typography variant="subtitle1" gutterBottom>
                    Glissez-déposez vos documents
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ou cliquez pour sélectionner
                  </Typography>
                  <input
                    id="file-input"
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    style={{ display: 'none' }}
                    onChange={(e) => handleFileUpload(e.target.files)}
                  />
                </Paper>

                {uploadedFiles.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Fichiers ({uploadedFiles.length})
                    </Typography>
                    <Stack spacing={1}>
                      {uploadedFiles.map((file, index) => (
                        <Paper key={index} sx={{ p: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Description color="primary" sx={{ fontSize: 16 }} />
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              flexGrow: 1, 
                              cursor: 'pointer',
                              '&:hover': { textDecoration: 'underline' }
                            }}
                            onClick={() => _previewFile(file)}
                          >
                            {file.filename.length > 20 ? file.filename.substring(0, 20) + '...' : file.filename}
                          </Typography>
                          <IconButton size="small" onClick={() => removeFile(index)}>
                            <Delete color="error" sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Paper>
                      ))}
                    </Stack>
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Actions
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Stack spacing={2}>
                  <LoadingButton
                    variant="contained"
                    fullWidth
                    startIcon={<Send />}
                    onClick={() => handleSubmit('submit')}
                    sx={{ py: 1.5 }}
                    loading={isSubmitting}
                  >
                    Soumettre au Conseiller principal
                  </LoadingButton>

                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<Save />}
                    onClick={() => handleSubmit('draft')}
                    sx={{ py: 1.5 }}
                  >
                    Enregistrer comme Brouillon
                  </Button>

                  <Button
                    variant="text"
                    fullWidth
                    startIcon={<Cancel />}
                    color="error"
                    sx={{ py: 1.5 }}
                  >
                    Annuler
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Snackbar
           open={snackbar.open}
           autoHideDuration={6000}
           anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
           onClose={() => setSnackbar({ ...snackbar, open: false })}
        > 
          <Alert
            severity={snackbar.severity}
            onClose={() => {
              setSnackbar({ ...snackbar, open: false });
              setAction(null);
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography>{snackbar.message}</Typography>
              {action}
            </Box>
          </Alert>
         </Snackbar>

         <PDFPreview
           open={previewOpen}
           onClose={() => setPreviewOpen(false)}
           file={previewFile}
         />
       </Box>
     </LocalizationProvider>
   );
 };

export default NouveauCourrier;
