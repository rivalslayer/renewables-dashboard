import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import Dashboard from './components/dashboard/Dashboard';
import { AppProvider } from './context/AppContext';
import './App.css';

const theme = createTheme({
  typography: {
    fontFamily: [
      'Avenir',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider>
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
          <Dashboard />
        </Box>
      </AppProvider>
    </ThemeProvider>
  );
};

export default App;
