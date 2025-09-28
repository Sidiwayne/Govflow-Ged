import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Divider,
  Stack,
  Paper,
  Box,
  IconButton,
  Tooltip,
  Button,
} from '@mui/material';
import {
  CloudUpload,
  Description,
  Download,
  ZoomIn,
  Add,
} from '@mui/icons-material';
import { DataDocument } from '../types/courrier';

interface CourrierDocumentsProps {
  documents: DataDocument[];
  onPreviewFile: (file: DataDocument) => void;
  onAddDocument: () => void;
}

const CourrierDocuments: React.FC<CourrierDocumentsProps> = ({
  documents,
  onPreviewFile,
  onAddDocument,
}) => {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CloudUpload color="primary" />
            Documents
          </Typography>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Add />}
            onClick={onAddDocument}
          >
            Ajouter un document au dossier
          </Button>
        </Box>
        <Divider sx={{ mb: 3 }} />

        {documents && documents.length > 0 ? (
          <Stack spacing={2}>
            {documents.map((document, index) => (
              <Paper key={index} sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Description color="primary" sx={{ fontSize: 24 }} />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    {document.filename}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Prévisualiser">
                    <IconButton
                      size="small"
                      onClick={() => onPreviewFile(document)}
                    >
                      <ZoomIn />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Télécharger">
                    <IconButton size="small">
                      <Download />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Paper>
            ))}
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
            Aucun document attaché
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default CourrierDocuments;
