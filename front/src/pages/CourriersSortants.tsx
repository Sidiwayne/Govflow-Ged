import {
  Add,
  FilterList,
  Search,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CourriersTable from '../components/CourriersTable';
import { useAppSelector } from '../store/hooks';
import { selectAllCourriersSortants } from '../store/slices/courrier';
import { Courrier } from '../types/courrier';


const CourriersSortants: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const courriers = useAppSelector(selectAllCourriersSortants);
  const navigate = useNavigate();
  
  const handleRowClick = (courrier: Courrier) => {
    navigate(`/courriers/sortants/${courrier.id}`);
  };

  const filteredCourriers = courriers.filter(courrier => {
    const matchesSearch = courrier.metadata.objet.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         courrier.metadata.expediteur.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         courrier.number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || courrier.status === statusFilter;
    const matchesPriority = !priorityFilter || courrier.metadata.priorite === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Courriers Sortants
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gestion des courriers envoyés par l'institution
        </Typography>
      </Box>

      {/* Filtres et recherche */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <TextField
                fullWidth
                label="Rechercher"
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Box>
            <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Statut</InputLabel>
                <Select
                  value={statusFilter}
                  label="Statut"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="">Tous</MenuItem>
                  <MenuItem value="in_progress">En cours</MenuItem>
                  <MenuItem value="closed">Traité</MenuItem>
                  <MenuItem value="archived">Archivé</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Priorité</InputLabel>
                <Select
                  value={priorityFilter}
                  label="Priorité"
                  onChange={(e) => setPriorityFilter(e.target.value)}
                >
                  <MenuItem value="">Toutes</MenuItem>
                  <MenuItem value="basse">Basse</MenuItem>
                  <MenuItem value="normale">Normale</MenuItem>
                  <MenuItem value="haute">Haute</MenuItem>
                  <MenuItem value="urgente">Urgente</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
              <Button
                variant="outlined"
                startIcon={<FilterList />}
                fullWidth
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('');
                  setPriorityFilter('');
                }}
              >
                Réinitialiser
              </Button>
            </Box>
            <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
              <Button
                variant="contained"
                startIcon={<Add />}
                fullWidth
                onClick={() => navigate('/courriers/nouveau')}
              >
                Nouveau Courrier
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Tableau des courriers */}
      <CourriersTable
        courriers={filteredCourriers}
        height={600}
        pageSize={10}
        pageSizeOptions={[10, 25, 50]}
        onRowClick={handleRowClick}
      />
    </Box>
  );
};

export default CourriersSortants;
