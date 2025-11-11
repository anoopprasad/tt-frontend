// Main layout component

import React, { useState } from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import { AppBar } from './AppBar';
import { Sidebar } from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar onMenuClick={handleDrawerToggle} />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={handleDrawerToggle} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - 240px)` },
          mt: '64px',
          minHeight: 'calc(100vh - 64px)',
          backgroundColor: (theme) =>
            theme.palette.mode === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
        }}
      >
        {children}
      </Box>
    </Box>
  );
};
