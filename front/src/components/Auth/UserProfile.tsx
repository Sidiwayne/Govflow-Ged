import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Grid,
  Divider,
  Paper,
} from '@mui/material';
import { useAppSelector } from '../../store/hooks';

const UserProfile: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  if (!user) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          Aucun utilisateur connecté
        </Typography>
      </Box>
    );
  }

  const getRoleLabel = (role: string) => {
    const roleLabels: Record<string, string> = {
      admin: 'Administrateur',
      secretaire: 'Secrétaire',
      conseiller_principal: 'Conseiller Principal',
      responsable_service: 'Responsable de Service',
      ministre: 'Ministre',
      archiviste: 'Archiviste',
    };
    return roleLabels[role] || role;
  };

  const getRoleColor = (role: string) => {
    const roleColors: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
      admin: 'error',
      secretaire: 'primary',
      conseiller_principal: 'secondary',
      responsable_service: 'info',
      ministre: 'warning',
      archiviste: 'success',
    };
    return roleColors[role] || 'default';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', mb: 3 }}>
        Profil Utilisateur
      </Typography>

      <Grid container spacing={3}>
        {/* Informations principales */}
        <Grid size={{xs: 12, md: 8}}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: 'primary.main',
                    fontSize: '2rem',
                    mr: 3,
                  }}
                >
                  {user.firstname.charAt(0)}{user.lastname.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h5" gutterBottom>
                    {user.firstname} {user.lastname}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" gutterBottom>
                    {user.email}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Chip
                      label={getRoleLabel(user.role)}
                      color={getRoleColor(user.role)}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <Chip
                      label={user?.entity.name}
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Grid container spacing={2}>
                <Grid size={{xs: 12, sm: 6}}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Prénom
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {user.firstname}
                  </Typography>
                </Grid>
                <Grid size={{xs: 12, sm: 6}}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Nom
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {user.lastname}
                  </Typography>
                </Grid>
                <Grid size={{xs: 12, sm: 6}}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {user.email}
                  </Typography>
                </Grid>
                <Grid size={{xs: 12, sm: 6}}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Téléphone
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {user.phone_number || 'Non renseigné'}
                  </Typography>
                </Grid>
                <Grid size={{xs: 12, sm: 6}}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Rôle
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {getRoleLabel(user.role)}
                  </Typography>
                </Grid>
                <Grid size={{xs: 12, sm: 6}}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Entité
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {user?.entity.name}
                  </Typography>
                </Grid>
                <Grid size={{xs: 12, sm: 6}}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Statut
                  </Typography>
                  <Chip
                    label={user.is_active ? 'Actif' : 'Inactif'}
                    color={user.is_active ? 'success' : 'error'}
                    size="small"
                  />
                </Grid>
                <Grid size={{xs: 12, sm: 6}}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Membre depuis
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {new Date(user.created_at).toLocaleDateString('fr-FR')}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Informations complémentaires */}
        <Grid size={{xs: 12, md: 4}}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Informations Système
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              ID Utilisateur: {user.id}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Dernière mise à jour: {new Date(user.updated_at).toLocaleDateString('fr-FR')}
            </Typography>
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Permissions
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Chip
                label="Lecture des courriers"
                color="success"
                size="small"
                variant="outlined"
              />
              <Chip
                label="Création de courriers"
                color="success"
                size="small"
                variant="outlined"
              />
              {user.role === 'admin' && (
                <Chip
                  label="Administration"
                  color="error"
                  size="small"
                  variant="outlined"
                />
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserProfile;
