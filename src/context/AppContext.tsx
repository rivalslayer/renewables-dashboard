import React, { createContext, useContext, useState, useEffect } from 'react';
import { FilterState, Alarm, Device } from '../types/data';

interface AppContextType {
  alarms: Alarm[];
  devices: Device[];
  locations: string[];
  filters: FilterState;
  loading: boolean;
  error: string | null;
  setFilters: (filters: FilterState | ((prev: FilterState) => FilterState)) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
        setLoading(true);
        const [alarmsResponse, devicesResponse] = await Promise.all([
          fetch('/data/fault.json'),
          fetch('/data/device.json')
        ]);

        const alarmsData = await alarmsResponse.json();
        const devicesData = await devicesResponse.json();

        setAlarms(alarmsData);
        setDevices(devicesData);
        setError(null);
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <AppContext.Provider value={{
      alarms,
      devices,
      locations,
      filters,
      loading,
      error,
      setFilters
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}; 