export interface Alarm {
  id: number;
  device_id: number;
  device_name: string;
  asset: string;
  fault_code: string;
  fault_description: string;
  start_time: string;
  end_time: string;
  duration: number;
  category: string;
}

export interface Device {
  id: number;
  device_name: string;
  asset: string;
  asset_id: number;
}

export interface FilterState {
  windfarm?: string;
  device?: string;
  timeRange?: {
    start: Date;
    end: Date;
  };
  faultType?: string;
  code?: string;
}

export interface AlarmStats {
  code: string;
  description: string;
  duration: number;
  count: number;
}

export interface CategoryStats {
  category: string;
  duration: number;
  count: number;
} 