import { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Button,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  AccountCircle,
  Logout,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useTimerStore } from '../../store/timerStore';
import { formatDuration } from '../../utils/formatters';
import { drawerWidth } from './Sidebar';

export const Header = ({ onMenuClick, onStartTimer }) => {
  const { user, logout } = useAuth();
  const { runningEntry, elapsedSeconds, updateElapsed } = useTimerStore();
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    if (runningEntry) {
      const interval = setInterval(() => {
        updateElapsed();
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [runningEntry, updateElapsed]);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { md: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` },
        backgroundColor: 'white',
        color: 'text.primary',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2, display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ flexGrow: 1 }} />

        {/* Timer Display or Start Button */}
        {runningEntry ? (
          <Chip
            icon={<StopIcon />}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" fontWeight={600}>
                  {formatDuration(elapsedSeconds)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • {runningEntry.description || 'No description'}
                </Typography>
              </Box>
            }
            onClick={onStartTimer}
            color="error"
            sx={{
              mr: 2,
              height: 40,
              px: 2,
              cursor: 'pointer',
              '& .MuiChip-label': {
                px: 1,
              },
            }}
          />
        ) : (
          <Button
            variant="contained"
            startIcon={<PlayIcon />}
            onClick={onStartTimer}
            sx={{ mr: 2 }}
          >
            Start Timer
          </Button>
        )}

        {/* User Menu */}
        <IconButton onClick={handleMenu} sx={{ ml: 1 }}>
          <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}>
            {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
          </Avatar>
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem disabled>
            <Box>
              <Typography variant="subtitle2">{user?.name || 'User'}</Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email}
              </Typography>
            </Box>
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <Logout fontSize="small" sx={{ mr: 1 }} />
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};
