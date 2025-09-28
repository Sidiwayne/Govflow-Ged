import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  ArrowBack,
} from '@mui/icons-material';
import PDFPreview from '../components/PDFPreview';
import TransmitDialog from '../components/TransmitDialog';
import AddDocumentDialog from '../components/AddDocumentDialog';
import CourrierHeader from '../components/CourrierHeader';
import CourrierMetadata from '../components/CourrierMetadata';
import CourrierDocuments from '../components/CourrierDocuments';
import CourrierHistory from '../components/CourrierHistory';
import { DataDocument, DataJoindreDocument } from '../types/courrier';
import { useAppSelector } from '../store/hooks';
import { selectCourrierById } from '../store/slices/courrier';

const CourrierDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [previewFile, setPreviewFile] = useState<DataDocument | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [transmitDialogOpen, setTransmitDialogOpen] = useState(false);
  const [addDocumentDialogOpen, setAddDocumentDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const courrier = useAppSelector((state) => selectCourrierById(state, id || ''));

  const handleTransmitClick = () => {
    setTransmitDialogOpen(true);
  };

  const handleTransmitClose = () => {
    setTransmitDialogOpen(false);
  };

  const handleTransmitSubmit = (transmitData: any) => {
    // Ici on ferait l'appel API pour transmettre le courrier
    console.log('Transmission data:', transmitData);
    setSnackbarMessage(`Courrier transmis avec succès à ${transmitData.recipients.length} destinataire(s)`);
    setSnackbarOpen(true);
    handleTransmitClose();
  };

  const handleAddDocumentToDossierClick = () => {
    setAddDocumentDialogOpen(true);
  };

  const handleAddDocumentDialogClose = () => {
    setAddDocumentDialogOpen(false);
  };

  const handleAddDocumentSubmit = (documents: (DataDocument & { size?: number })[]) => {
    // Ici on ferait l'appel API pour ajouter les documents au courrier
    console.log('Adding documents to courrier:', documents);
    // TODO: Dispatch action to add documents to courrier
    setSnackbarMessage(`${documents.length} document(s) ajouté(s) au dossier avec succès`);
    setSnackbarOpen(true);
    handleAddDocumentDialogClose();
  };

  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const documents = useMemo(() => {
    return courrier?.nodes
      .reduce((acc: DataDocument[], node) => {
        const documents = node.actions.filter(({type}) => type === 'joindre_document').map(({data}) => (data as DataJoindreDocument).documents);
        return [...acc, ...documents.flat()];
      }, [])
  }, [courrier]);

  const handlePreviewFile = (file: DataDocument) => {
    setPreviewFile(file);
    setPreviewOpen(true);
  };

  if (!courrier) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="error">
          Courrier non trouvé
        </Typography>
        <Button onClick={() => navigate(-1)} startIcon={<ArrowBack />}>
          Retour
        </Button>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ p: 3 }}>
        <CourrierHeader 
          courrier={courrier}
          onTransmit={handleTransmitClick}
          onNavigate={navigate}
        />

        <Grid container spacing={3}>
          {/* Colonne gauche - Métadonnées et Documents */}
          <Grid size={{xs: 12, md: 8}}>
            <CourrierMetadata courrier={courrier} />
            <CourrierDocuments 
              documents={documents || []}
              onPreviewFile={handlePreviewFile}
              onAddDocument={handleAddDocumentToDossierClick}
            />
          </Grid>

          {/* Colonne droite - Historique */}
          <Grid size={{xs: 12, md: 4}}>
            <CourrierHistory courrier={courrier} />
          </Grid>
        </Grid>
      </Box>

      <PDFPreview
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        file={previewFile}
      />

      {/* Modal de Transmission */}
      <TransmitDialog
        open={transmitDialogOpen}
        onClose={handleTransmitClose}
        onSubmit={handleTransmitSubmit}
        documents={documents || []}
        courrierId={courrier?.id || ''}
        nodeId={courrier?.nodes.find(node => node.status === 'active')?.id || ''}
      />

      {/* Modal d'Ajout de Documents au Dossier */}
      <AddDocumentDialog
        open={addDocumentDialogOpen}
        onClose={handleAddDocumentDialogClose}
        onSubmit={handleAddDocumentSubmit}
      />

      {/* Snackbar pour les notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CourrierDetailPage;
