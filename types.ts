
export enum ViewMode {
  DASHBOARD = 'DASHBOARD',
  REMOTE_DESKTOP = 'REMOTE_DESKTOP',
  FILES = 'FILES',
  TERMINAL = 'TERMINAL',
  USERS = 'USERS',
  LOGS = 'LOGS',
  NETWORK = 'NETWORK',
  VMS = 'VMS'
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

export interface RealUser {
  username: string;
  uid: number;
  gid: number;
  shell: string;
  home: string;
  status: 'Active' | 'Inactive';
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}
