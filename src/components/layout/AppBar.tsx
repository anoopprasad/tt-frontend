// App bar component with timer and user menu

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Box,
  Button,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Logout,
  PlayArrow,
  Stop,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useTimerStore } from '../../store/timerStore';
import { useUIStore } from '../../store/uiStore';
import { useLogout } from '../../hooks/useAuth';
import { useStopTimer } from '../../hooks/useTimeEntries';
import { formatDuration } from '../../utils/date';

interface AppBarProps {
  onMenuClick: () => void;
}

export const AppBar: React.FC<AppBarProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { user, logout: logoutContext } = useAuth();
  const { mutate: logout } = useLogout();
  const { mutate: stopTimer } = useStopTimer();
  const { sidebarOpen, setChatOpen } = useUIStore();
  const { runningEntry, startTime, elapsedSeconds, updateElapsed, reset } = useTimerStore();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  // Update elapsed time every second
  useEffect(() => {
    if (startTime) {
      const interval = setInterval(() => {
        updateElapsed();
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [startTime, updateElapsed]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    await logout();
    logoutContext();
  };

  const handleStopTimer = () => {
    if (runningEntry) {
      stopTimer(runningEntry.id, {
        onSuccess: () => {
          reset();
        },
      });
    }
  };

  const handleStartTimer = () => {
    navigate('/time-log');
  };

  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  return (
    <MuiAppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Time Tracker
        </Typography>

        {/* Timer Display */}
        {runningEntry && startTime ? (
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <Chip
              icon={<Stop />}
              label={`${formatDuration(elapsedSeconds)}`}
              color="error"
              onClick={handleStopTimer}
              sx={{ cursor: 'pointer' }}
            />
          </Box>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<PlayArrow />}
              onClick={handleStartTimer}
            >
              Start Timer
            </Button>
          </Box>
        )}

        {/* User Menu */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            size="large"
            edge="end"
            onClick={handleMenuOpen}
            color="inherit"
          >
            {user ? (
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                {getInitials(user.email)}
              </Avatar>
            ) : (
              <AccountCircle />
            )}
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            {user && (
              <MenuItem disabled>
                <Typography variant="body2">{user.email}</Typography>
              </MenuItem>
            )}
            <MenuItem onClick={handleLogout}>
              <Logout sx={{ mr: 1 }} fontSize="small" />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </MuiAppBar>
  );
};
