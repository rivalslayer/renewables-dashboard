import React from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { useAppContext } from '../../context/AppContext';

const Filters: React.FC = () => {
  const { devices, filters, setFilters } = useAppContext();

  // Get unique locations from devices
  const locations = React.useMemo(() => {
    const uniqueLocations = new Set(devices.map(device => device.asset));
    return Array.from(uniqueLocations).sort();
  }, [devices]);

  // Get devices for selected location
  const locationDevices = React.useMemo(() => {
    if (!filters.location) return [];
    return devices
      .filter(device => device.asset === filters.location)
      .map(device => device.device_name)
      .sort();
  }, [devices, filters.location]);

  const handleLocationChange = (event: SelectChangeEvent) => {
    setFilters(prev => ({
      ...prev,
      location: event.target.value,
      device: '' // Reset device when location changes
    }));
  };

  const handleDeviceChange = (event: SelectChangeEvent) => {
    setFilters(prev => ({
      ...prev,
      device: event.target.value
    }));
  };

  return (
    <Box sx={{ mb: 1 }}>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Location</InputLabel>
          <Select
            value={filters.location || ''}
            onChange={handleLocationChange}
            label="Location"
          >
            <MenuItem value="">All Locations</MenuItem>
            {locations.map(location => (
              <MenuItem key={location} value={location}>
                {location}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Device</InputLabel>
          <Select
            value={filters.device || ''}
            onChange={handleDeviceChange}
            label="Device"
            disabled={!filters.location}
          >
            <MenuItem value="">All Devices</MenuItem>
            {locationDevices.map(device => (
              <MenuItem key={device} value={device}>
                {device}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};

export default Filters; 