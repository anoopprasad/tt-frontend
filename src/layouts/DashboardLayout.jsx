import { useState, useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Badge,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  AccessTime as AccessTimeIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountCircleIcon,
  PlayArrow as PlayArrowIcon,
  Stop as StopIcon,
} from '@mui/icons-material'
import { useAuth } from '../contexts/AuthContext'
import useTimerStore from '../stores/timerStore'
import useUIStore from '../stores/uiStore'
import TimerModal from '../components/TimerModal'
import AIChat from '../components/AIChat'

const drawerWidth = 280

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Time Log', icon: <AccessTimeIcon />, path: '/time-log' },
  { text: 'Reports', icon: <AssessmentIcon />, path: '/reports' },
  { text: 'Manage', icon: <SettingsIcon />, path: '/manage' },
]

export default function DashboardLayout() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const { runningTimer, elapsedSeconds, formatTime, stopTimer } = useTimerStore()
  const { sidebarOpen, mobileSidebarOpen, setSidebarOpen, toggleMobileSidebar, setMobileSidebarOpen } = useUIStore()
  const [anchorEl, setAnchorEl] = useState(null)
  const [timerModalOpen, setTimerModalOpen] = useState(false)

  useEffect(() => {
    if (!isMobile) {
      setMobileSidebarOpen(false)
    }
  }, [isMobile, setMobileSidebarOpen])

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = async () => {
    handleMenuClose()
    await logout()
    navigate('/login')
  }

  const handleStartTimer = () => {
    setTimerModalOpen(true)
  }

  const handleStopTimer = async () => {
    if (runningTimer?.id) {
      try {
        const { timeEntryService } = await import('../services/timeEntryService')
        await timeEntryService.stopTimer(runningTimer.id)
        stopTimer()
      } catch (error) {
        console.error('Error stopping timer:', error)
      }
    }
  }

  const drawer = (
    <Box>
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: [1],
          py: 2,
        }}
      >
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700, color: 'primary.main' }}>
          Time Tracker
        </Typography>
      </Toolbar>
      <Divider />
      <List sx={{ px: 2, py: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <MenuItem
              key={item.text}
              onClick={() => {
                navigate(item.path)
                if (isMobile) {
                  setMobileSidebarOpen(false)
                }
              }}
              sx={{
                mb: 0.5,
                borderRadius: 2,
                backgroundColor: isActive ? 'primary.light' : 'transparent',
                color: isActive ? 'white' : 'text.primary',
                '&:hover': {
                  backgroundColor: isActive ? 'primary.light' : 'action.hover',
                },
                py: 1.5,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                {item.icon}
                <Typography variant="body1" sx={{ fontWeight: isActive ? 600 : 400 }}>
                  {item.text}
                </Typography>
              </Box>
            </MenuItem>
          )
        })}
      </List>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${sidebarOpen ? drawerWidth : 0}px)` },
          ml: { md: `${sidebarOpen ? drawerWidth : 0}px` },
          backgroundColor: 'background.paper',
          color: 'text.primary',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={isMobile ? toggleMobileSidebar : () => setSidebarOpen(!sidebarOpen)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ flexGrow: 1 }} />

          {/* Timer Display */}
          {runningTimer ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mr: 2,
                px: 2,
                py: 1,
                borderRadius: 2,
                backgroundColor: 'error.light',
                color: 'white',
              }}
            >
              <Badge
                badgeContent=""
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    animation: 'pulse 2s infinite',
                  },
                  '@keyframes pulse': {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.5 },
                  },
                }}
              >
                <AccessTimeIcon />
              </Badge>
              <Typography variant="body1" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                {formatTime(elapsedSeconds)}
              </Typography>
              <IconButton size="small" onClick={handleStopTimer} sx={{ color: 'white' }}>
                <StopIcon />
              </IconButton>
            </Box>
          ) : (
            <IconButton
              onClick={handleStartTimer}
              sx={{
                mr: 2,
                backgroundColor: 'primary.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              }}
            >
              <PlayArrowIcon />
            </IconButton>
          )}

          <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
            <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}>
              {user?.email?.[0]?.toUpperCase() || 'U'}
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
              {user?.email || 'User'}
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <LogoutIcon sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Desktop Sidebar */}
      <Box
        component="nav"
        sx={{ width: { md: sidebarOpen ? drawerWidth : 0 }, flexShrink: { md: 0 }, transition: 'width 0.3s' }}
        aria-label="navigation"
      >
        <Drawer
          variant="permanent"
          open={sidebarOpen}
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: '1px solid',
              borderColor: 'divider',
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Mobile Sidebar */}
      <Drawer
        variant="temporary"
        open={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${sidebarOpen ? drawerWidth : 0}px)` },
          backgroundColor: 'background.default',
          minHeight: '100vh',
          transition: 'width 0.3s',
        }}
      >
        <Toolbar />
        <Box sx={{ p: 3 }}>
          <Outlet />
        </Box>
      </Box>

      <TimerModal open={timerModalOpen} onClose={() => setTimerModalOpen(false)} />
      <AIChat />
    </Box>
  )
}
