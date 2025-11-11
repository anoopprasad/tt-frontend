import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import {
  Container,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Link as MuiLink,
  Alert,
} from '@mui/material'
import { useAuth } from '../contexts/AuthContext'
import { useSnackbar } from 'notistack'

export default function SignupPage() {
  const navigate = useNavigate()
  const { signup } = useAuth()
  const { enqueueSnackbar } = useSnackbar()
  const [error, setError] = useState('')
  const { register, handleSubmit, formState: { errors }, watch } = useForm()

  const password = watch('password')

  const onSubmit = async (data) => {
    try {
      setError('')
      await signup(data.email, data.password)
      enqueueSnackbar('Account created successfully', { variant: 'success' })
      navigate('/dashboard')
    } catch (err) {
      const errorMessage = err.response?.data?.error?.message || 'Signup failed. Please try again.'
      setError(errorMessage)
      enqueueSnackbar(errorMessage, { variant: 'error' })
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
        <Card sx={{ width: '100%', p: 3 }}>
          <CardContent>
            <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4, fontWeight: 700 }}>
              Create Account
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
                  autoComplete="email"
                  error={!!errors.email}
                  helperText={errors.email?.message}
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
                  autoComplete="new-password"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />

                <TextField
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) => value === password || 'Passwords do not match',
                  })}
                  label="Confirm Password"
                  type="password"
                  fullWidth
                  autoComplete="new-password"
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{ mt: 2 }}
                >
                  Sign Up
                </Button>
              </Box>
            </form>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <MuiLink component={Link} to="/login" underline="hover">
                  Sign in
                </MuiLink>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  )
}
