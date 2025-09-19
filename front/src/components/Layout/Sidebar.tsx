import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  Badge,
} from '@mui/material';
import {
  Dashboard,
  Mail,
  MailOutline,
  Send,
  Archive,
  People,
  Business,
  Assessment,
  Settings,
  Folder,
  Notifications,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  drawerWidth: number;
}

const menuItems = [
  {
    text: 'Tableau de bord',
    icon: <Dashboard />,
    path: '/',
  },
  {
    text: 'Courriers Entrants',
    icon: <Mail />,
    path: '/courriers/entrants',
    badge: 12,
  },
  {
    text: 'Courriers Sortants',
    icon: <Send />,
    path: '/courriers/sortants',
  },
  {
    text: 'Nouveau Courrier',
    icon: <MailOutline />,
    path: '/courriers/nouveau',
  },
  {
    text: 'Archives',
    icon: <Archive />,
    path: '/archives',
  },
  {
    text: 'Suivi',
    icon: <Folder />,
    path: '/suivi',
  },
];

const adminItems = [
  {
    text: 'Utilisateurs',
    icon: <People />,
    path: '/admin/utilisateurs',
  },
  {
    text: 'Entités',
    icon: <Business />,
    path: '/admin/entites',
  },
  {
    text: 'Rapports',
    icon: <Assessment />,
    path: '/admin/rapports',
  },
  {
    text: 'Paramètres',
    icon: <Settings />,
    path: '/admin/parametres',
  },
];

const Sidebar: React.FC<SidebarProps> = ({ open, onClose, drawerWidth }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);
  const handleNavigation = (path: string) => {
    navigate(path);
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        transition: theme => theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: '1px solid #e0e0e0',
          backgroundColor: '#ffffff',
          position: 'fixed',
          top: 64, // Header height
          height: 'calc(100vh - 64px)', // Subtract header height
          overflow: 'hidden', // Prevent sidebar from scrolling
          transition: theme => theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
      }}
    >
      <Box sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0', flexShrink: 0 }}>
          <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
            {user?.entity?.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {user?.entity?.description}
          </Typography>
        </Box>

        <Box sx={{ 
          flex: 1, 
          overflow: 'auto',
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#c1c1c1',
            borderRadius: '3px',
            '&:hover': {
              background: '#a8a8a8',
            },
          },
        }}>
          <List sx={{ pt: 1 }}>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  selected={isActive(item.path)}
                  sx={{
                    mx: 1,
                    borderRadius: 1,
                    '&.Mui-selected': {
                      color: 'primary.main',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive(item.path) ? 'primary.main' : 'inherit',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        {item.text}
                        {item.badge && (
                          <Badge badgeContent={item.badge} color="error" />
                        )}
                      </Box>
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600 }}>
              Administration
            </Typography>
          </Box>

          <List>
            {adminItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  selected={isActive(item.path)}
                  sx={{
                    mx: 1,
                    borderRadius: 1,
                    '&.Mui-selected': {
                      color: 'primary.main',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive(item.path) ? 'primary.main' : 'inherit',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
