import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Paper,
  Grid,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loginUser } from '../../store/slices/auth/thunks';
import { LoginCredentials } from '../../types/auth';
import { Navigate } from 'react-router-dom';
import FadeIn from '../Transitions/FadeIn';
import { clearError } from '../../store/slices/auth';

const LoginForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);
  
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser(credentials));
  };

  const handleInputChange = (field: keyof LoginCredentials, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
  };

  if (isAuthenticated) {
    return <Navigate to="/" />;
    // return (
    //   <Box sx={{ p: 3, textAlign: 'center' }}>
    //     <Alert severity="success">
    //       Connexion réussie ! Redirection en cours...
    //     </Alert>
    //   </Box>
    // );
  }

  return (
    <FadeIn duration={800} delay={100}>
      <Box
        sx={{
          minHeight: '100vh',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #007481 0%, #27ae60 100%)',
          p: 2,
        }}
      >
      <Paper
        elevation={8}
        sx={{
          width: '70%',
          borderRadius: 2,
          height: '100%',
        }}
      >
        <Card sx={{ height: '80vh', width: '100%' }}>
          <Box sx={{ display: 'flex', height: '100%'}}>
            {/* Left Column - Welcome Message */}
            <Box sx={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center',
              alignItems: 'center',
              p: 4,
              background: 'linear-gradient(135deg, #007481 0%, #27ae60 100%)',
              color: 'white',
              position: 'relative'
            }}>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h2" component="h1" gutterBottom sx={{ 
                  fontWeight: 600,
                  mb: 3,
                  color: 'white'
                }}>
                  Bienvenue sur GovFlow GEC
                </Typography>
                <Typography variant="body1" sx={{ 
                  opacity: 0.9,
                  lineHeight: 1.6,
                  maxWidth: 400,
                  mb: 4
                }}>
                  L'outil de gestion de courrier électronique pour de la Présidence. 
                  Simplifiez le traitement, la traçabilité et le suivi de vos courriers entrants et sortants.
                </Typography>
              </Box>

              <Box sx={{ mt: 'auto', mb: 2 }}>
                <Box
                  component="img"
                  src="/armoirie.png"
                  alt="Airmoirie"
                  sx={{
                    height: 80,
                    objectFit: 'contain',
                  }}
                />
              </Box>
              
              <Box sx={{ mt: 'auto', mb: 2 }}>
                <Box
                  component="img"
                  src="/logo-simandou.png"
                  alt="Logo Simandou"
                  sx={{
                    height: 80,
                    objectFit: 'contain',
                    filter: 'brightness(0) invert(1)',
                  }}
                />
              </Box>
            </Box>

            {/* Right Column - Login Form */}
            <Box sx={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center',
              p: 4
            }}>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h5" component="h2" gutterBottom sx={{ 
                  color: 'primary.main',
                  fontWeight: 600
                }}>
                  Connexion
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Accédez à votre espace de travail
                </Typography>
              </Box>

              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={credentials.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  margin="normal"
                  required
                  autoComplete="email"
                  autoFocus
                />
                
                <TextField
                  fullWidth
                  label="Mot de passe"
                  type="password"
                  value={credentials.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  margin="normal"
                  required
                  autoComplete="current-password"
                />

                {error && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                  </Alert>
                )}

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={isLoading}
                  sx={{ mt: 3, mb: 2, py: 1.5 }}
                >
                  {isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Se connecter'
                  )}
                </Button>
              </form>

              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Version de démonstration
                </Typography>
              </Box>
            </Box>
          </Box>
        </Card>
      </Paper>
      </Box>
    </FadeIn>
  );
};

export default LoginForm;
