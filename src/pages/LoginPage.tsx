// Login page

import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Container,
  Paper,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Link as MuiLink,
} from '@mui/material';
import { useLogin } from '../hooks/useAuth';
import { useAuth } from '../contexts/AuthContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { mutate: login, isPending, error } = useLogin();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(
      { email, password },
      {
        onSuccess: () => {
          const from = (location.state as any)?.from?.pathname || '/dashboard';
          navigate(from, { replace: true });
        },
      }
    );
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Time Tracker
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary" paragraph>
            Sign in to your account
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {(error as any).message || 'Login failed. Please try again.'}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isPending}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isPending}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isPending}
            >
              {isPending ? 'Signing in...' : 'Sign In'}
            </Button>
            <Box textAlign="center">
              <MuiLink component={Link} to="/signup" variant="body2">
                Don't have an account? Sign Up
              </MuiLink>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};
