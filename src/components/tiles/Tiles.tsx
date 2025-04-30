import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import { useAppContext } from '../../context/AppContext';

interface TileProps {
  title: string;
  value: string;
  color: 'red' | 'green';
}

const Tile: React.FC<TileProps> = ({ title, value, color }) => (
  <Paper
    elevation={2}
    sx={{
      p: 2,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      backgroundColor: color === 'red' ? '#ffebee' : '#e8f5e9',
    }}
  >
    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
      {title}
    </Typography>
    <Typography
      variant="body1"
      component="div"
      sx={{ color: color === 'red' ? '#d32f2f' : '#2e7d32' }}
    >
      {value}
    </Typography>
  </Paper>
);

const Tiles: React.FC = () => {
  const { alarms, devices, filters } = useAppContext();

  // Get devices for selected location
  const locationDevices = filters.location 
    ? devices.filter(device => device.asset === filters.location)
    : devices;

  // Filter alarms based on selected location and device
  const filteredAlarms = alarms.filter(alarm => {
    if (filters.location && !filters.device) {
      return locationDevices.some(device => device.id === alarm.device_id);
    }
    if (filters.device) {
      const selectedDevice = locationDevices.find(d => d.device_name === filters.device);
      return selectedDevice && alarm.device_id === selectedDevice.id;
    }
    return true;
  });

  // Calculate total duration in seconds
  const totalDurationSeconds = filteredAlarms.reduce((sum, alarm) => sum + alarm.duration_seconds, 0);
  
  // Convert total seconds to hours, minutes, seconds
  const hours = Math.floor(totalDurationSeconds / 3600);
  const minutes = Math.floor((totalDurationSeconds % 3600) / 60);
  const seconds = Math.floor(totalDurationSeconds % 60);

  // Find device with max duration
  const deviceDurations = filteredAlarms.reduce((acc, alarm) => {
    acc[alarm.device_id] = (acc[alarm.device_id] || 0) + alarm.duration_seconds;
    return acc;
  }, {} as Record<number, number>);

  const maxDurationDeviceId = Object.entries(deviceDurations).reduce((max, [deviceId, duration]) => 
    duration > (deviceDurations[max] || 0) ? Number(deviceId) : max, 0
  );

  const maxDurationDevice = locationDevices.find(d => d.id === maxDurationDeviceId);
  const maxDuration = Math.max(...Object.values(deviceDurations));

  const maxDurationHours = Math.floor(maxDuration / 3600);
  const maxDurationMinutes = Math.floor((maxDuration % 3600) / 60);
  const maxDurationSeconds = Math.floor(maxDuration % 60);

  const tilesData = [
    {
      title: 'TOTAL ALARM DURATION',
      value: `${hours}h ${minutes}m ${seconds}s`,
      color: 'red' as const,
    },
    {
      title: 'TOTAL COUNT OF ALARMS',
      value: filteredAlarms.length.toString(),
      color: 'green' as const,
    },
    {
      title: 'DEVICE WITH MAX DURATION ALARM',
      value: maxDurationDevice ? `${maxDurationDevice.device_name} (${maxDurationDevice.asset})` : 'N/A',
      color: 'green' as const,
    },
    {
      title: 'MAX DURATION ALARM TIME',
      value: `${maxDurationHours}h ${maxDurationMinutes}m ${maxDurationSeconds}s`,
      color: 'green' as const,
    },
  ];

  return (
    <Grid container spacing={2}>
      {tilesData.map((tile, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Tile {...tile} />
        </Grid>
      ))}
    </Grid>
  );
};

export default Tiles; 