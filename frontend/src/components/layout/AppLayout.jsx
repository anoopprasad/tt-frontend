import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Toolbar } from '@mui/material';
import { Sidebar, drawerWidth } from './Sidebar';
import { Header } from './Header';
import { TimerDialog } from '../time/TimerDialog';

export const AppLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [timerDialogOpen, setTimerDialogOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleStartTimer = () => {
    setTimerDialogOpen(true);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Header onMenuClick={handleDrawerToggle} onStartTimer={handleStartTimer} />
      <Sidebar mobileOpen={mobileOpen} onDrawerToggle={handleDrawerToggle} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          backgroundColor: '#f8f9fa',
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>

      <TimerDialog open={timerDialogOpen} onClose={() => setTimerDialogOpen(false)} />
    </Box>
  );
};
