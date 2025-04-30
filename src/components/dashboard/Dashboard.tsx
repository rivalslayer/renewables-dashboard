import React from 'react';
import { Box, Container, Grid, CircularProgress, Alert, Paper, Typography } from '@mui/material';
import Filters from '../filters/Filters';
import Tiles from '../tiles/Tiles';
import Charts from '../charts/Charts';
import DataTable from '../table/DataTable';
import { useAppContext } from '../../context/AppContext';

const Dashboard: React.FC = () => {
  const { loading, error } = useAppContext();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Container maxWidth={false}>
      <Box sx={{ mt: 2 }}>
        {/* Header with Logo */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 4, 
          pb: 2, 
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}>
          <Box
            component="img"
            src="/src/assets/img/avathon_logo.png"
            alt="Avathon Logo"
            sx={{ height: 40, mr: 2 }}
          />
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontSize: '1.2rem', 
              fontWeight: 'normal',
              display: 'flex',
              alignItems: 'flex-end',
              height: '40px'
            }}
          >
            Renewables Dashboard
          </Typography>
        </Box>

        {/* Main Content */}
        <Grid container spacing={3}>
          {/* Filters Section */}
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ py: 1, px: 3 }}>
              <Typography variant="h6" gutterBottom>
                Filters
              </Typography>
              <Filters />
            </Paper>
          </Grid>

          {/* Tiles Section */}
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Summary
              </Typography>
              <Tiles />
            </Paper>
          </Grid>

          {/* Charts Section */}
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Alarm Analysis
              </Typography>
              <Charts />
            </Paper>
          </Grid>

          {/* Data Table Section */}
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Alarm Details
              </Typography>
              <DataTable />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard; 