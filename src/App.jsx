import { Routes, Route, Navigate } from 'react-router-dom'
import { Box } from '@mui/material'
import { useAuth } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Sidebar } from './components/Layout/Sidebar'
import { Header } from './components/Layout/Header'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { TimeLog } from './pages/TimeLog'
import { Reports } from './pages/Reports'
import { Manage } from './pages/Manage'
import { AIChat } from './components/AIChat/AIChat'

function AppLayout({ children }) {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          width: { md: `calc(100% - 260px)` },
        }}
      >
        <Header />
        <Box sx={{ mt: 8, p: 3 }}>
          {children}
        </Box>
      </Box>
      <AIChat />
    </Box>
  )
}

function App() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return null
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/time-log" element={<TimeLog />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/manage" element={<Manage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AppLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App
