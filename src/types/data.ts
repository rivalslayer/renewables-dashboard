export interface Device {
  id: number;
  device_name: string;
  asset: string;
  asset_id: number;
}

export interface Alarm {
  id?: number;
  device_id: number;
  time_stamp: string;
  resolution_time_stamp: string;
  code: number;
  description: string;
  duration_seconds: number;
  asset_id: number;
  asset?: string;
  category: string;
  fault_type: string;
}

export interface FilterState {
  location: string;
  device: string;
  timeRange?: '24h' | '7d' | '30d' | '';
  faultType: string;
  alarmCode: string;
} 