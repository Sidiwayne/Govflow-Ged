import React, { useState } from 'react';
import { Box, CssBaseline, useTheme, useMediaQuery, GlobalStyles } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';


const Layout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const drawerWidth = 280;

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <GlobalStyles
        styles={{
          body: {
            margin: 0,
            padding: 0,
            overflow: 'hidden',
            height: '100vh',
          },
          html: {
            height: '100%',
            overflow: 'hidden',
          },
        }}
      />
      <CssBaseline />
      
      <Header onMenuClick={handleSidebarToggle} />
      
      <Sidebar
        open={sidebarOpen}
        onClose={handleSidebarClose}
        drawerWidth={drawerWidth}
      />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
          backgroundColor: 'background.default',
          height: 'calc(100vh - 64px)', // Subtract header height
          overflow: 'auto', // Only main content scrolls
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#c1c1c1',
            borderRadius: '4px',
            '&:hover': {
              background: '#a8a8a8',
            },
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
