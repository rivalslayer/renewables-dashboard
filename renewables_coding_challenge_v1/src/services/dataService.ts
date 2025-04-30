import { Alarm, FilterState, AlarmStats, CategoryStats } from '../types';

// Simple data processing functions
export const processAlarms = (alarms: Alarm[], filters: FilterState) => {
  let filteredAlarms = [...alarms];

  // Apply filters
  if (filters.windfarm) {
    filteredAlarms = filteredAlarms.filter(alarm => 
      alarm.asset === filters.windfarm
    );
  }

  if (filters.device) {
    filteredAlarms = filteredAlarms.filter(alarm => 
      alarm.device_name === filters.device
    );
  }

  if (filters.timeRange) {
    // Simple time range filter
    filteredAlarms = filteredAlarms.filter(alarm => {
      const alarmDate = new Date(alarm.start_time);
      return alarmDate >= filters.timeRange!.start && alarmDate <= filters.timeRange!.end;
    });
  }

  return filteredAlarms;
};

// Simple aggregation functions
export const getTopAlarmsByDuration = (alarms: Alarm[], limit: number = 10): AlarmStats[] => {
  const alarmGroups = alarms.reduce((acc, alarm) => {
    if (!acc[alarm.fault_code]) {
      acc[alarm.fault_code] = {
        code: alarm.fault_code,
        description: alarm.fault_description,
        duration: 0,
        count: 0
      };
    }
    acc[alarm.fault_code].duration += alarm.duration;
    acc[alarm.fault_code].count += 1;
    return acc;
  }, {} as Record<string, AlarmStats>);

  return Object.values(alarmGroups)
    .sort((a, b) => b.duration - a.duration)
    .slice(0, limit);
};

export const getTopAlarmsByFrequency = (alarms: Alarm[], limit: number = 10): AlarmStats[] => {
  const alarmGroups = alarms.reduce((acc, alarm) => {
    if (!acc[alarm.fault_code]) {
      acc[alarm.fault_code] = {
        code: alarm.fault_code,
        description: alarm.fault_description,
        count: 0,
        duration: 0
      };
    }
    acc[alarm.fault_code].count += 1;
    acc[alarm.fault_code].duration += alarm.duration;
    return acc;
  }, {} as Record<string, AlarmStats>);

  return Object.values(alarmGroups)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
};

export const getAlarmsByCategory = (alarms: Alarm[]): Record<string, CategoryStats> => {
  return alarms.reduce((acc, alarm) => {
    if (!acc[alarm.category]) {
      acc[alarm.category] = {
        category: alarm.category,
        duration: 0,
        count: 0
      };
    }
    acc[alarm.category].duration += alarm.duration;
    acc[alarm.category].count += 1;
    return acc;
  }, {} as Record<string, CategoryStats>);
}; 