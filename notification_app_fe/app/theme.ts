'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    background: {
      default: '#f3f4f6', // Light gray outer background
      paper: '#ffffff',
    },
    primary: {
      main: '#0f172a', // Slate 900
    },
    secondary: {
      main: '#64748b', // Slate 500
    },
    info: { main: '#3b82f6' }, // Blue 500
    success: { main: '#10b981' }, // Emerald 500
    warning: { main: '#f59e0b' }, // Amber 500
    error: { main: '#ef4444' }, // Red 500
    text: {
      primary: '#0f172a',
      secondary: '#475569',
      disabled: '#94a3b8',
    },
    divider: '#e2e8f0', // Slate 200
  },
  typography: {
    fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        },
      },
    },
  },
});

export default theme;
