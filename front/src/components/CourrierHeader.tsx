import React from 'react';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Box,
  Chip,
  Button,
  Breadcrumbs,
  Link,
} from '@mui/material';
import {
  Edit,
  Send,
  CheckCircle,
  Archive,
} from '@mui/icons-material';
import { Courrier } from '../types/courrier';

interface CourrierHeaderProps {
  courrier: Courrier;
  onTransmit: () => void;
  onNavigate: (path: string) => void;
}

const CourrierHeader: React.FC<CourrierHeaderProps> = ({
  courrier,
  onTransmit,
  onNavigate,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_progress':
        return 'warning';
      case 'closed':
        return 'success';
      case 'archived':
        return 'default';
      default:
        return 'default';
    }
  };

  const getBreadcrumbPath = () => {
    const basePath = courrier.flow === 'entrant' ? 'courriers/entrants' : 'courriers/sortants';
    const baseLabel = courrier.flow === 'entrant' ? 'Courriers Entrants' : 'Courriers Sortants';
    return { path: basePath, label: baseLabel };
  };

  const breadcrumb = getBreadcrumbPath();

  return (
    <>
      {/* Breadcrumb et navigation */}
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link 
            color="inherit" 
            href={`/${breadcrumb.path}`}
            onClick={(e) => {
              e.preventDefault();
              onNavigate(`/${breadcrumb.path}`);
            }}
          >
            {breadcrumb.label}
          </Link>
          <Typography color="text.primary">{courrier.number}</Typography>
        </Breadcrumbs>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Typography variant="h4" sx={{ flex: 1 }}>
            Détail du Courrier
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" startIcon={<Edit />}>
              Modifier
            </Button>
            <Button variant="outlined" startIcon={<Send />} onClick={onTransmit}>
              Répondre
            </Button>
            <Button variant="outlined" startIcon={<Send />} onClick={onTransmit}>
              Annoter
            </Button>
            <Button variant="contained" startIcon={<Send />} onClick={onTransmit}>
              Transmettre
            </Button>
            <Button variant="outlined" startIcon={<CheckCircle />}>
              Valider
            </Button>
            <Button variant="outlined" color="error" startIcon={<CheckCircle />}>
              Réjeter
            </Button>
            <Button variant="outlined" startIcon={<Archive />}>
              Archiver
            </Button>
          </Box>
        </Box>
      </Box>

      {/* En-tête */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid size={{xs: 12, md: 8}}>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
                {courrier.metadata.objet}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Chip
                  label={courrier.status === 'in_progress' ? 'En cours' : courrier.status === 'closed' ? 'Traité' : 'Archivé'}
                  color={getStatusColor(courrier.status)}
                  variant="outlined"
                />
                <Chip
                  label={courrier.flow === 'entrant' ? 'Entrant' : 'Sortant'}
                  color="primary"
                  variant="outlined"
                />
              </Box>
            </Grid>
            <Grid size={{xs: 12, md: 4}}>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="body2" color="text.secondary">
                  Référence
                </Typography>
                <Typography variant="h6" sx={{ fontFamily: 'monospace' }}>
                  {courrier.number}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
};

export default CourrierHeader;
