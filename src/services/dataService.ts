import { Device, Alarm } from '../types/data';

class DataService {
  private devices: Device[] = [];
  private alarms: Alarm[] = [];

  async loadData() {
    try {
      // Load device data
      const deviceResponse = await fetch('/data/device.json');
      this.devices = await deviceResponse.json();

      // Load alarm data
      const alarmResponse = await fetch('/data/fault.json');
      this.alarms = await alarmResponse.json();

      return {
        devices: this.devices,
        alarms: this.alarms
      };
    } catch (error) {
      console.error('Error loading data:', error);
      throw error;
    }
  }

  getDevicesByLocation(location: string): Device[] {
    return this.devices.filter(device => device.asset === location);
  }

  getAlarmsByDevice(deviceId: number): Alarm[] {
    return this.alarms.filter(alarm => alarm.device_id === deviceId);
  }

  getAlarmsByLocation(location: string): Alarm[] {
    const locationDevices = this.getDevicesByLocation(location);
    const deviceIds = locationDevices.map(device => device.id);
    return this.alarms.filter(alarm => deviceIds.includes(alarm.device_id));
  }
}

export const dataService = new DataService(); 