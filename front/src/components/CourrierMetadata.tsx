import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Divider,
  Grid,
  Box,
  Chip,
} from '@mui/material';
import {
  Description,
  Person,
  Schedule,
  PriorityHigh,
  Security,
  Label,
} from '@mui/icons-material';
import { Courrier } from '../types/courrier';

interface CourrierMetadataProps {
  courrier: Courrier;
}

const CourrierMetadata: React.FC<CourrierMetadataProps> = ({ courrier }) => {
  const getPriorityColor = (priorite: string) => {
    switch (priorite.toLowerCase()) {
      case 'urgente':
        return 'error';
      case 'haute':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getConfidentialityColor = (confidentialite: string) => {
    switch (confidentialite.toLowerCase()) {
      case 'secret':
        return 'error';
      case 'confidentiel':
        return 'warning';
      case 'interne':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent sx={{ py: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Description color="primary" />
          Métadonnées
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={2}>
          <Grid size={{xs: 12, md: 6}}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Type de courrier
              </Typography>
              <Typography variant="body1">{courrier.type}</Typography>
            </Box>
          </Grid>

          <Grid size={{xs: 12, md: 6}}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Canal de réception
              </Typography>
              <Typography variant="body1">{courrier.metadata.canalReception}</Typography>
            </Box>
          </Grid>

          <Grid size={{xs: 12, md: 6}}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Expéditeur
              </Typography>
              <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Person sx={{ fontSize: 16, color: 'text.secondary' }} />
                {courrier.metadata.expediteur}
              </Typography>
            </Box>
          </Grid>

          <Grid size={{xs: 12, md: 6}}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Date de réception
              </Typography>
              <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Schedule sx={{ fontSize: 16, color: 'text.secondary' }} />
                {new Date(courrier.metadata.dateReception).toLocaleDateString('fr-FR')}
              </Typography>
            </Box>
          </Grid>

          <Grid size={{xs: 12, md: 6}}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Priorité
              </Typography>
              <Chip
                label={courrier.metadata.priorite}
                color={getPriorityColor(courrier.metadata.priorite)}
                size="small"
                icon={<PriorityHigh />}
              />
            </Box>
          </Grid>

          <Grid size={{xs: 12, md: 6}}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Confidentialité
              </Typography>
              <Chip
                label={courrier.metadata.confidentialite || 'Non défini'}
                color={getConfidentialityColor(courrier.metadata.confidentialite || '')}
                size="small"
                icon={<Security />}
              />
            </Box>
          </Grid>

          {courrier.metadata.referenceExterne && (
            <Grid size={{xs: 12, md: 6}}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Référence externe
                </Typography>
                <Typography variant="body1">{courrier.metadata.referenceExterne}</Typography>
              </Box>
            </Grid>
          )}

          {courrier.metadata.tags && courrier.metadata.tags.length > 0 && (
            <Grid size={{xs: 12, md: 6}}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Tags / Catégories
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {courrier.metadata.tags.map(tag => (
                    <Chip
                      key={tag}
                      label={tag}
                      color="primary"
                      variant="outlined"
                      size="small"
                      icon={<Label />}
                    />
                  ))}
                </Box>
              </Box>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default CourrierMetadata;
