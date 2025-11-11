import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Error as ErrorIcon } from '@mui/icons-material';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            bgcolor: 'background.default',
            p: 3,
          }}
        >
          <Paper
            sx={{
              p: 4,
              maxWidth: 500,
              textAlign: 'center',
            }}
          >
            <ErrorIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
              Oops! Something went wrong
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              We're sorry for the inconvenience. The application encountered an unexpected error.
            </Typography>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Paper
                sx={{
                  p: 2,
                  mt: 2,
                  bgcolor: 'grey.100',
                  textAlign: 'left',
                  overflow: 'auto',
                  maxHeight: 200,
                }}
              >
                <Typography variant="caption" component="pre">
                  {this.state.error.toString()}
                </Typography>
              </Paper>
            )}
            <Button
              variant="contained"
              onClick={() => window.location.href = '/'}
              sx={{ mt: 3 }}
            >
              Return to Dashboard
            </Button>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}
