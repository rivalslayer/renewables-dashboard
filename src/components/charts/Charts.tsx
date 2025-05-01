import React, { useMemo } from 'react';
import { Box, Paper, Tabs, Tab, Typography, Grid } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useAppContext } from '../../context/AppContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

// Helper function to format duration in hours (for Y-axis)
const formatDuration = (value: number) => {
  const hours = Math.floor(value / 3600);
  const minutes = Math.floor((value % 3600) / 60);
  const seconds = Math.floor(value % 60);
  return `${hours}h ${minutes}m ${seconds}s`;
};

const formatDurationShort = (value: number) => {
  const hours = Math.round(value / 3600 / 10) * 10; // Round to nearest 10 hours
  return `${hours}h`;
};

const COLORS = [
  '#1f77b4', // blue
  '#ff7f0e', // orange
  '#2ca02c', // green
  '#d62728', // red
  '#9467bd', // purple
  '#8c564b', // brown
  '#e377c2', // pink
  '#7f7f7f', // gray
  '#bcbd22', // olive
  '#17becf', // cyan
  '#aec7e8', // light blue
  '#ffbb78', // light orange
  '#98df8a', // light green
  '#ff9896', // light red
  '#c5b0d5', // light purple
  '#c49c94', // light brown
];

const Charts: React.FC = () => {
  const { alarms, devices, filters } = useAppContext();
  const [tabValue, setTabValue] = React.useState(0);

  // Memoize device lookup map for faster access
  const deviceMap = useMemo(() => {
    const map = new Map<number, { device_name: string; asset: string }>();
    devices.forEach(device => {
      map.set(device.id, { device_name: device.device_name, asset: device.asset });
    });
    return map;
  }, [devices]);

  // Memoize filtered alarms
  const filteredAlarms = useMemo(() => {
    return alarms.filter(alarm => {
      const device = deviceMap.get(alarm.device_id);
      if (!device) return false;

      if (filters.location && device.asset !== filters.location) return false;
      if (filters.device && device.device_name !== filters.device) return false;
      if (filters.timeRange) {
        const alarmDate = new Date(alarm.time_stamp.replace('+00', 'Z').replace(' ', 'T'));
        const now = new Date();
        const diffHours = (now.getTime() - alarmDate.getTime()) / (1000 * 60 * 60);
        if (filters.timeRange === '24h' && diffHours > 24) return false;
        if (filters.timeRange === '7d' && diffHours > 168) return false;
        if (filters.timeRange === '30d' && diffHours > 720) return false;
      }
      if (filters.faultType && alarm.category !== filters.faultType) return false;
      if (filters.alarmCode && alarm.code.toString() !== filters.alarmCode) return false;
      return true;
    });
  }, [alarms, filters, deviceMap]);

  // Memoize data for Alarms by Category (Duration)
  const alarmsByCategoryDuration = useMemo(() => {
    if (!filteredAlarms.length) return [];

    const grouped = filteredAlarms.reduce((acc, alarm) => {
      const category = alarm.category || 'Uncategorized';
      if (typeof alarm.duration_seconds !== 'number' || isNaN(alarm.duration_seconds)) {
        return acc;
      }
      const duration = Math.max(0, alarm.duration_seconds);
      acc[category] = (acc[category] || 0) + duration;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped)
      .map(([category, totalDuration]) => ({
        name: category,
        value: totalDuration,
        label: category
      }))
      .sort((a, b) => b.value - a.value);
  }, [filteredAlarms]);

  // Memoize data for Alarms by Category (Frequency)
  const alarmsByCategoryFrequency = useMemo(() => {
    if (!filteredAlarms.length) return [];

    const grouped = filteredAlarms.reduce((acc, alarm) => {
      const category = alarm.category || 'Uncategorized';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped)
      .map(([category, count]) => ({
        name: category,
        value: count,
        label: category
      }))
      .sort((a, b) => b.value - a.value);
  }, [filteredAlarms]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Paper elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Duration" />
          <Tab label="Frequency" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box sx={{ height: 400, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="subtitle1" gutterBottom>
                Alarms by Category (Duration) - Bar Chart
              </Typography>
              {alarmsByCategoryDuration.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={alarmsByCategoryDuration}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="label" 
                      angle={-45} 
                      textAnchor="end" 
                      height={60}
                      tick={{ fontSize: 12 }}
                      interval={0}
                    />
                    <YAxis 
                      tickFormatter={formatDurationShort}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      formatter={(value: number) => formatDuration(value)}
                      labelFormatter={(label) => `Category: ${label}`}
                    />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Typography variant="body1" color="text.secondary">
                  No data available for the selected filters
                </Typography>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ height: 400, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="subtitle1" gutterBottom>
                Alarms by Category (Duration) - Pie Chart
              </Typography>
              {alarmsByCategoryDuration.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={alarmsByCategoryDuration}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {alarmsByCategoryDuration.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => formatDuration(value)}
                      labelFormatter={(label) => `Category: ${label}`}
                    />
                    <Legend 
                      layout="vertical" 
                      verticalAlign="middle" 
                      align="right"
                      wrapperStyle={{ paddingLeft: '20px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Typography variant="body1" color="text.secondary">
                  No data available for the selected filters
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box sx={{ height: 400, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="subtitle1" gutterBottom>
                Alarms by Category (Frequency) - Bar Chart
              </Typography>
              {alarmsByCategoryFrequency.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={alarmsByCategoryFrequency}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="label" 
                      angle={-45} 
                      textAnchor="end" 
                      height={60}
                      tick={{ fontSize: 12 }}
                      interval={0}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      formatter={(value: number) => value}
                      labelFormatter={(label) => `Category: ${label}`}
                    />
                    <Bar dataKey="value" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Typography variant="body1" color="text.secondary">
                  No data available for the selected filters
                </Typography>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ height: 400, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="subtitle1" gutterBottom>
                Alarms by Category (Frequency) - Pie Chart
              </Typography>
              {alarmsByCategoryFrequency.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={alarmsByCategoryFrequency}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={120}
                      fill="#82ca9d"
                      dataKey="value"
                    >
                      {alarmsByCategoryFrequency.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => value}
                      labelFormatter={(label) => `Category: ${label}`}
                    />
                    <Legend 
                      layout="vertical" 
                      verticalAlign="middle" 
                      align="right"
                      wrapperStyle={{ paddingLeft: '20px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Typography variant="body1" color="text.secondary">
                  No data available for the selected filters
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </TabPanel>
    </Paper>
  );
};

export default Charts; 