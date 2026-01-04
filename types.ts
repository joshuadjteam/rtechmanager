
export enum ViewMode {
  DASHBOARD = 'DASHBOARD',
  REMOTE_DESKTOP = 'REMOTE_DESKTOP',
  FILES = 'FILES'
}

export interface SystemStats {
  ramUsed: number;
  ramTotal: number;
  cpuUsage: number;
  hddUsed: number;
  hddTotal: number;
}

export interface ServerInfo {
  deviceName: string;
  ram: string;
  hddModel: string;
  cpuModel: string;
  os: string;
}

export interface FileItem {
  name: string;
  type: 'folder' | 'file';
  size?: string;
}
