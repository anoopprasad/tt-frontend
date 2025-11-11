import {
  AppBar as MuiAppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Button,
  Chip,
} from '@mui/material'
import {
  Menu as MenuIcon,
  AccountCircle,
  PlayArrow,
  Stop,
} from '@mui/icons-material'
import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useTimerStore } from '../../stores/timerStore'
import TimerModal from '../common/TimerModal'

const AppBar = ({ drawerWidth, sidebarOpen, onSidebarToggle }) => {
  const { user, logout } = useAuth()
  const [anchorEl, setAnchorEl] = useState(null)
  const [timerModalOpen, setTimerModalOpen] = useState(false)
  
  const isRunning = useTimerStore((state) => state.isRunning)
  const elapsedSeconds = useTimerStore((state) => state.elapsedSeconds)
  const description = useTimerStore((state) => state.description)

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = async () => {
    handleMenuClose()
    await logout()
  }

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <>
      <MuiAppBar
        position="fixed"
        sx={{
          width: { md: sidebarOpen ? `calc(100% - ${drawerWidth}px)` : '100%' },
          ml: { md: sidebarOpen ? `${drawerWidth}px` : 0 },
          transition: (theme) =>
            theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          backgroundColor: 'background.paper',
          color: 'text.primary',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={onSidebarToggle}
            sx={{ mr: 2, display: { md: sidebarOpen ? 'none' : 'inline-flex' } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {/* This space is intentionally left for page-specific content */}
          </Typography>

          {/* Timer Display or Start Button */}
          <Box sx={{ mr: 2 }}>
            {isRunning ? (
              <Chip
                icon={<Stop />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, minWidth: 70 }}>
                      {formatTime(elapsedSeconds)}
                    </Typography>
                    {description && (
                      <Typography
                        variant="body2"
                        sx={{
                          maxWidth: 200,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {description}
                      </Typography>
                    )}
                  </Box>
                }
                onClick={() => setTimerModalOpen(true)}
                color="primary"
                sx={{
                  height: 40,
                  px: 2,
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                }}
              />
            ) : (
              <Button
                variant="contained"
                startIcon={<PlayArrow />}
                onClick={() => setTimerModalOpen(true)}
                sx={{ height: 40 }}
              >
                Start Timer
              </Button>
            )}
          </Box>

          {/* User Menu */}
          <Box>
            <IconButton onClick={handleMenuOpen} size="large">
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
              </Avatar>
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
              <MenuItem disabled>
                <Typography variant="body2">{user?.email}</Typography>
              </MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </MuiAppBar>

      <TimerModal open={timerModalOpen} onClose={() => setTimerModalOpen(false)} />
    </>
  )
}

export default AppBar
