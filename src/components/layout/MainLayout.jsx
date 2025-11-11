import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Box, useMediaQuery, useTheme } from '@mui/material'
import AppBar from './AppBar'
import Sidebar from './Sidebar'
import AIChat from '../common/AIChat'
import { useTimerStore } from '../../stores/timerStore'

const DRAWER_WIDTH = 280

const MainLayout = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)
  const updateElapsed = useTimerStore((state) => state.updateElapsed)

  // Update timer every second
  useEffect(() => {
    const interval = setInterval(() => {
      updateElapsed()
    }, 1000)

    return () => clearInterval(interval)
  }, [updateElapsed])

  // Close sidebar on mobile when screen size changes
  useEffect(() => {
    setSidebarOpen(!isMobile)
  }, [isMobile])

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        drawerWidth={DRAWER_WIDTH}
        sidebarOpen={sidebarOpen}
        onSidebarToggle={handleSidebarToggle}
      />
      <Sidebar
        drawerWidth={DRAWER_WIDTH}
        open={sidebarOpen}
        onClose={handleSidebarToggle}
        isMobile={isMobile}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          ml: isMobile ? 0 : sidebarOpen ? `${DRAWER_WIDTH}px` : 0,
          transition: theme.transitions.create(['margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          backgroundColor: theme.palette.background.default,
          minHeight: '100vh',
        }}
      >
        <Outlet />
      </Box>
      <AIChat />
    </Box>
  )
}

export default MainLayout
