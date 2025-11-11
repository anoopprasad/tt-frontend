import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
      light: '#9fa8f7',
      dark: '#4c63d2',
      contrastText: '#fff',
    },
    secondary: {
      main: '#764ba2',
      light: '#a177cc',
      dark: '#5a3879',
      contrastText: '#fff',
    },
    success: {
      main: '#43e97b',
      light: '#69ed95',
      dark: '#32ae5b',
    },
    warning: {
      main: '#f093fb',
      light: '#f5b3fc',
      dark: '#d76ef6',
    },
    error: {
      main: '#f44336',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.25)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        },
      },
    },
  },
});
