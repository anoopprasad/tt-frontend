// Signup page

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
import { useSignup } from '../hooks/useAuth';

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { mutate: signup, isPending, error } = useSignup();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signup(
      { email, password, name: name || undefined },
      {
        onSuccess: () => {
          navigate('/dashboard', { replace: true });
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
            Create Account
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary" paragraph>
            Sign up to get started
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {(error as any).message || 'Signup failed. Please try again.'}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              fullWidth
              id="name"
              label="Name (Optional)"
              name="name"
              autoComplete="name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isPending}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
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
              autoComplete="new-password"
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
              {isPending ? 'Creating account...' : 'Sign Up'}
            </Button>
            <Box textAlign="center">
              <MuiLink component={Link} to="/login" variant="body2">
                Already have an account? Sign In
              </MuiLink>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};
