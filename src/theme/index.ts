import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import React from 'react';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#000000', // Black for buttons
      contrastText: '#ffffff', // White text on black buttons
    },
    background: {
      default: '#000000', // Black background for main page
      paper: '#ffffff', // White background for cards/forms
    },
    text: {
      primary: '#111827', // Near-black text on white backgrounds
      secondary: '#4b5563', // Gray text for secondary content
    },
  },
  typography: {
    fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#000000', // Ensure body is black
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          backgroundColor: '#000000',
          color: '#ffffff',
          borderRadius: '18px',
          fontWeight: 'bold',
          boxShadow: '0 6px 18px rgba(0, 0, 0, 0.25)',
          '&:hover': {
            backgroundColor: '#111111',
            transform: 'translateY(-1px)',
            boxShadow: '0 10px 24px rgba(0, 0, 0, 0.35)',
          },
          '&:disabled': {
            opacity: 0.8,
            backgroundColor: '#000000',
            color: '#ffffff',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#111827',
          borderRadius: '16px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            '& fieldset': {
              borderColor: '#d1d5db',
              borderWidth: '1px',
            },
            '&:hover fieldset': {
              borderColor: '#111827',
              borderWidth: '1px',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#111827',
              borderWidth: '1px',
              boxShadow: 'none',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#111827',
            '&.Mui-focused': {
              color: '#111827',
            },
          },
          '& .MuiOutlinedInput-input': {
            color: '#111827',
            backgroundColor: '#ffffff !important',
            // Override browser autocomplete styling
            '&:-webkit-autofill': {
              backgroundColor: '#ffffff !important',
              boxShadow: '0 0 0 1000px #ffffff inset !important',
              borderRadius: '12px !important',
              WebkitTextFillColor: '#111827 !important',
            },
            '&:-webkit-autofill:hover': {
              backgroundColor: '#ffffff !important',
              boxShadow: '0 0 0 1000px #ffffff inset !important',
            },
            '&:-webkit-autofill:focus': {
              backgroundColor: '#ffffff !important',
              boxShadow: '0 0 0 1000px #ffffff inset !important',
            },
            '&:-webkit-autofill:active': {
              backgroundColor: '#ffffff !important',
              boxShadow: '0 0 0 1000px #ffffff inset !important',
            },
          },
        },
      },
    },
  },
});

export function MuiProvider({ children }: { children: React.ReactNode }) {
  return React.createElement(
    ThemeProvider,
    { theme },
    React.createElement(CssBaseline),
    children
  );
}
