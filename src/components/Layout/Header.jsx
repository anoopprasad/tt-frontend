import { useState } from 'react'
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Box,
  Button,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import LogoutIcon from '@mui/icons-material/Logout'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import StopIcon from '@mui/icons-material/Stop'
import { useAuth } from '../../contexts/AuthContext'
import { useTimerStore } from '../../stores/timerStore'
import { useUIStore } from '../../stores/uiStore'
import { useSnackbar } from '../SnackbarProvider'
import { formatDuration } from '../../utils/dateUtils'
import { StartTimerModal } from '../Timer/StartTimerModal'

export const Header = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { user, logout } = useAuth()
  const { toggleSidebar } = useUIStore()
  const { runningTimer, elapsedSeconds, stopTimer } = useTimerStore()
  const { showSnackbar } = useSnackbar()
  const [anchorEl, setAnchorEl] = useState(null)
  const [timerModalOpen, setTimerModalOpen] = useState(false)

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = async () => {
    handleMenuClose()
    await logout()
    window.location.href = '/login'
  }

  const handleStartTimer = () => {
    setTimerModalOpen(true)
  }

  const handleStopTimer = async () => {
    if (runningTimer?.id) {
      // Call API to stop timer
      const { timeEntriesApi } = await import('../../api/timeEntries')
      try {
        await timeEntriesApi.stop(runningTimer.id)
        stopTimer()
        showSnackbar('Timer stopped', 'success')
      } catch (error) {
        showSnackbar(
          error.response?.data?.error?.message || 'Failed to stop timer',
          'error'
        )
      }
    } else {
      stopTimer()
    }
  }

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: 'white',
          color: 'text.primary',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={toggleSidebar}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Box sx={{ flexGrow: 1 }} />

          {/* Timer Display or Start Button */}
          {runningTimer ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mr: 2 }}>
              <Chip
                icon={<StopIcon />}
                label={`${formatDuration(elapsedSeconds)} - ${runningTimer.description || 'Timer'}`}
                onClick={handleStopTimer}
                color="error"
                sx={{
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: 'error.dark',
                  },
                }}
              />
            </Box>
          ) : (
            <Button
              variant="contained"
              startIcon={<PlayArrowIcon />}
              onClick={handleStartTimer}
              sx={{ mr: 2 }}
            >
              Start Timer
            </Button>
          )}

          {/* User Menu */}
          <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36 }}>
              {user?.email?.charAt(0).toUpperCase() || 'U'}
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
              <AccountCircleIcon sx={{ mr: 1 }} />
              <Typography variant="body2">{user?.email || 'User'}</Typography>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <LogoutIcon sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <StartTimerModal open={timerModalOpen} onClose={() => setTimerModalOpen(false)} />
    </>
  )
}
