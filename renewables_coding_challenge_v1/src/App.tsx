import React from 'react';
import { Box, Container, Grid, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  height: '100%',
  minHeight: '200px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
}));

function App() {
  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Wind Farm Alarms Dashboard
        </Typography>
      </Box>

      {/* Filters Section */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <Item>
            <Typography variant="h6" gutterBottom>Filters</Typography>
            {/* Filters will go here */}
          </Item>
        </Grid>
      </Grid>

      {/* Stats Tiles */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Item>
            <Typography variant="h6" gutterBottom>Total Alarms</Typography>
            {/* Stats will go here */}
          </Item>
        </Grid>
        <Grid item xs={12} md={3}>
          <Item>
            <Typography variant="h6" gutterBottom>Average Duration</Typography>
            {/* Stats will go here */}
          </Item>
        </Grid>
        <Grid item xs={12} md={3}>
          <Item>
            <Typography variant="h6" gutterBottom>Most Frequent</Typography>
            {/* Stats will go here */}
          </Item>
        </Grid>
        <Grid item xs={12} md={3}>
          <Item>
            <Typography variant="h6" gutterBottom>Critical Devices</Typography>
            {/* Stats will go here */}
          </Item>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Top 10 Alarms by Duration */}
        <Grid item xs={12} md={6}>
          <Item>
            <Typography variant="h6" gutterBottom>Top 10 Alarms (Duration)</Typography>
            {/* Chart will go here */}
          </Item>
        </Grid>
        {/* Top 10 Alarms by Frequency */}
        <Grid item xs={12} md={6}>
          <Item>
            <Typography variant="h6" gutterBottom>Top 10 Alarms (Frequency)</Typography>
            {/* Chart will go here */}
          </Item>
        </Grid>
        {/* Alarms by Category Duration */}
        <Grid item xs={12} md={6}>
          <Item>
            <Typography variant="h6" gutterBottom>Alarms by Category (Duration)</Typography>
            {/* Chart will go here */}
          </Item>
        </Grid>
        {/* Alarms by Category Frequency */}
        <Grid item xs={12} md={6}>
          <Item>
            <Typography variant="h6" gutterBottom>Alarms by Category (Frequency)</Typography>
            {/* Chart will go here */}
          </Item>
        </Grid>
      </Grid>

      {/* Data Table */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Item>
            <Typography variant="h6" gutterBottom>Alarm Details</Typography>
            {/* Table will go here */}
          </Item>
        </Grid>
      </Grid>
    </Container>
  );
}

export default App; 