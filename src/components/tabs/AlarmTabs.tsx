import React, { useState } from 'react';
import { Box, Tabs, Tab, Paper, Typography } from '@mui/material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`alarm-tabpanel-${index}`}
      aria-labelledby={`alarm-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const AlarmTabs: React.FC = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Paper elevation={2}>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="alarm analysis tabs"
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label="By Alarm Code" />
        <Tab label="By Category" />
        <Tab label="By Device" />
      </Tabs>

      <TabPanel value={value} index={0}>
        <Typography variant="h6" gutterBottom>
          Total Alarm Duration: 71 hrs, 53 min, 46 sec
        </Typography>
        {/* Bar chart will be implemented here */}
        <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography color="text.secondary">
            Bar Chart - Top 10 Alarm Codes by Duration
          </Typography>
        </Box>
      </TabPanel>

      <TabPanel value={value} index={1}>
        <Typography variant="h6" gutterBottom>
          Alarms by Category
        </Typography>
        {/* Category analysis will be implemented here */}
        <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography color="text.secondary">
            Category Analysis Chart
          </Typography>
        </Box>
      </TabPanel>

      <TabPanel value={value} index={2}>
        <Typography variant="h6" gutterBottom>
          Alarms by Device
        </Typography>
        {/* Device analysis will be implemented here */}
        <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography color="text.secondary">
            Device Analysis Chart
          </Typography>
        </Box>
      </TabPanel>
    </Paper>
  );
};

export default AlarmTabs; 