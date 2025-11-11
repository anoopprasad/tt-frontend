// Main App component

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ToastProvider } from './components/common/ToastProvider';
import { MainLayout } from './components/layout/MainLayout';
import { AIChat } from './components/chat/AIChat';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardPage } from './pages/DashboardPage';
import { TimeLogPage } from './pages/TimeLogPage';
import { ReportsPage } from './pages/ReportsPage';
import { ManagePage } from './pages/ManagePage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ToastProvider>
            <AuthProvider>
              <BrowserRouter>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <Navigate to="/dashboard" replace />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <DashboardPage />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/time-log"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <TimeLogPage />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reports"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <ReportsPage />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/manage"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <ManagePage />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
              </Routes>
              <AIChat />
            </BrowserRouter>
          </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
