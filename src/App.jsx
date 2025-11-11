import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DashboardPage from './pages/DashboardPage'
import TimeLogPage from './pages/TimeLogPage'
import ReportsPage from './pages/ReportsPage'
import ManagePage from './pages/ManagePage'
import { lazy, Suspense } from 'react'
import { Box, CircularProgress } from '@mui/material'

const ErrorBoundary = lazy(() => import('./components/ErrorBoundary'))

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    )
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    <Suspense fallback={
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    }>
      <ErrorBoundary>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="time-log" element={<TimeLogPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="manage" element={<ManagePage />} />
          </Route>
        </Routes>
      </ErrorBoundary>
    </Suspense>
  )
}

export default App
