import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1a237e', light: '#534bae', dark: '#000051' },
    secondary: { main: '#ff6f00', light: '#ffa000', dark: '#c43e00' },
    background: { default: '#f0f2f5', paper: '#ffffff' },
    success: { main: '#2e7d32' },
    warning: { main: '#ed6c02' },
    error: { main: '#d32f2f' },
    info: { main: '#0288d1' },
    admin: { main: '#1a237e', bg: '#e8eaf6' },
    manager: { main: '#1b5e20', bg: '#e8f5e9' },
    client: { main: '#0d47a1', bg: '#e3f2fd' },
  },
  typography: {
    fontFamily: '"Nunito", "Segoe UI", sans-serif',
    h1: { fontWeight: 800 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { fontWeight: 600, textTransform: 'none' },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCard: {
      styleOverrides: {
        root: { boxShadow: '0 2px 12px rgba(0,0,0,0.08)', borderRadius: 16 },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 10, padding: '8px 20px' },
        contained: { boxShadow: '0 4px 12px rgba(0,0,0,0.15)' },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: { '& .MuiOutlinedInput-root': { borderRadius: 10 } },
      },
    },
    MuiChip: {
      styleOverrides: { root: { fontWeight: 600 } },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: { background: '#1a237e', color: '#fff' },
      },
    },
  },
});

export default theme;
