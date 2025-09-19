import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Button,
} from '@mui/material';
import {
  Mail,
  Send,
  Archive,
  TrendingUp,
  Warning,
  CheckCircle,
  Schedule,
  Add,
} from '@mui/icons-material';
import { Courrier } from '../types/courrier';
import { Stats } from '../types/index';
import { useAppSelector } from '../store/hooks';
import { selectAllCourriersEntrants } from '../store/slices/courrier';
import CourriersTable from '../components/CourriersTable';
import { useNavigate } from 'react-router-dom';

// Données de démonstration
const mockStats: Stats = {
  courriersEntrants: 156,
  courriersSortants: 89,
  courriersEnCours: 23,
  courriersTraites: 122,
  courriersUrgents: 8,
  tauxTraitement: 78.2,
};


const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  trend?: string;
}> = ({ title, value, icon, color, trend }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography color="text.secondary" gutterBottom variant="body2">
            {title}
          </Typography>
          <Typography variant="h4" component="div" sx={{ fontWeight: 600, color }}>
            {value}
          </Typography>
          {trend && (
            <Typography variant="caption" color="success.main" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <TrendingUp sx={{ fontSize: 16, mr: 0.5 }} />
              {trend}
            </Typography>
          )}
        </Box>
        <Box sx={{ color, opacity: 0.8 }}>
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard: React.FC = () => {
  const courriers = useAppSelector(selectAllCourriersEntrants);
  const navigate = useNavigate();

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Tableau de bord
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Vue d'ensemble de la gestion électronique de courrier
        </Typography>
      </Box>

      {/* Statistiques */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
        <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
          <StatCard
            title="Courriers Entrants"
            value={mockStats.courriersEntrants}
            icon={<Mail sx={{ fontSize: 40 }} />}
            color="#007481"
            trend="+12% ce mois"
          />
        </Box>
        <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
          <StatCard
            title="Courriers Sortants"
            value={mockStats.courriersSortants}
            icon={<Send sx={{ fontSize: 40 }} />}
            color="#4da3b0"
            trend="+8% ce mois"
          />
        </Box>
        <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
          <StatCard
            title="En Cours"
            value={mockStats.courriersEnCours}
            icon={<Schedule sx={{ fontSize: 40 }} />}
            color="#ff9800"
          />
        </Box>
        <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
          <StatCard
            title="Taux de Traitement"
            value={`${mockStats.tauxTraitement}%`}
            icon={<CheckCircle sx={{ fontSize: 40 }} />}
            color="#4caf50"
          />
        </Box>
      </Box>

      {/* Actions rapides et courriers récents */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        <Box sx={{ flex: '2 1 600px', minWidth: 0 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Courriers Récents
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  size="small"
                >
                  Nouveau Courrier
                </Button>
              </Box>
              <CourriersTable
                courriers={courriers}
                height={400}
                pageSize={5}
                pageSizeOptions={[5]}
                onRowClick={(courrier) => {
                  // Rediriger vers la page de détail appropriée selon le type
                  const basePath = courrier.flow === 'entrant' ? '/courriers/entrants' : '/courriers/sortants';
                  navigate(`${basePath}/${courrier.id}`);
                }}
              />
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Actions Rapides
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Mail color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Courriers Urgents"
                    secondary={`${mockStats.courriersUrgents} courriers en attente`}
                  />
                  <Chip label="Urgent" color="error" size="small" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Warning color="warning" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Courriers en Retard"
                    secondary="3 courriers dépassent le délai"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Archive color="action" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Archives"
                    secondary="45 courriers archivés ce mois"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
