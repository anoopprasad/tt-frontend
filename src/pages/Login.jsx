import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Container,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Link as MuiLink,
} from '@mui/material'
import { useForm } from 'react-hook-form'
import { useAuth } from '../contexts/AuthContext'
import { useSnackbar } from '../components/SnackbarProvider'

export const Login = () => {
  const navigate = useNavigate()
  const { login, signup } = useAuth()
  const { showSnackbar } = useSnackbar()
  const [isSignup, setIsSignup] = useState(false)
  const [error, setError] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()

  const onSubmit = async (data) => {
    setError('')
    try {
      const result = isSignup
        ? await signup(data.email, data.password)
        : await login(data.email, data.password)

      if (result.success) {
        showSnackbar(
          isSignup ? 'Account created successfully!' : 'Logged in successfully!',
          'success'
        )
        navigate('/')
      } else {
        setError(result.error || 'Authentication failed')
      }
    } catch (err) {
      setError(err.message || 'An error occurred')
    }
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Card sx={{ width: '100%', maxWidth: 440 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Typography variant="h4" component="h1" gutterBottom fontWeight={600}>
                {isSignup ? 'Create Account' : 'Welcome Back'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {isSignup
                  ? 'Sign up to start tracking your time'
                  : 'Sign in to your account'}
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                label="Email"
                type="email"
                fullWidth
                margin="normal"
                error={!!errors.email}
                helperText={errors.email?.message}
                autoComplete="email"
              />

              <TextField
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                error={!!errors.password}
                helperText={errors.password?.message}
                autoComplete={isSignup ? 'new-password' : 'current-password'}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                sx={{ mt: 3, mb: 2 }}
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? 'Please wait...'
                  : isSignup
                  ? 'Sign Up'
                  : 'Sign In'}
              </Button>
            </form>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {isSignup ? 'Already have an account? ' : "Don't have an account? "}
                <MuiLink
                  component="button"
                  type="button"
                  onClick={() => {
                    setIsSignup(!isSignup)
                    setError('')
                  }}
                  sx={{ cursor: 'pointer' }}
                >
                  {isSignup ? 'Sign In' : 'Sign Up'}
                </MuiLink>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  )
}
