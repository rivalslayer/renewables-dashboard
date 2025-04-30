import React, { createContext, useContext, useState, useEffect } from 'react';
import { FilterState, Alarm, Device } from '../types/data';

interface AppContextType {
  alarms: Alarm[];
  devices: Device[];
  locations: string[];
  filters: FilterState;
  setFilters: (filters: FilterState | ((prev: FilterState) => FilterState)) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    location: '',
    device: '',
    timeRange: '',
    faultType: '',
    alarmCode: ''
  });

  // Get unique locations from devices
  const locations = Array.from(new Set(devices.map(device => device.asset))).filter(Boolean);

  useEffect(() => {
    // Load data from JSON files
    const loadData = async () => {
      try {
        const [alarmsResponse, devicesResponse] = await Promise.all([
          fetch('/data/fault.json'),
          fetch('/data/device.json')
        ]);

        const alarmsData = await alarmsResponse.json();
        const devicesData = await devicesResponse.json();

        setAlarms(alarmsData);
        setDevices(devicesData);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  return (
    <AppContext.Provider value={{ alarms, devices, locations, filters, setFilters }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}; 