export type View = 'dashboard' | 'products' | 'stock' | 'images' | 'tags' | 'price' | 'analytics' | 'batchControl' | 'settings';

export interface ShopifyConfig {
  storeDomain: string;
  accessToken: string;
  locationId: string;
  googleSheetId: string;
}

export type LogType = 'INFO' | 'SUCCESS' | 'WARN' | 'ERROR';

export interface LogEntry {
  type: LogType;
  message: string;
  timestamp: string;
}

export type ConnectionStatus = 'UNTESTED' | 'TESTING' | 'CONNECTED' | 'FAILED';

// --- New Types for Multi-User Auth ---

export type Role = 'ADMIN' | 'CLIENT';

export interface User {
  id: string;
  username: string;
  password; // NOTE: In a real app, this would be hashed.
  role: Role;
  config: ShopifyConfig;
  connectionStatus: ConnectionStatus;
  // Subscription details, relevant for CLIENT role
  subscriptionStatus?: 'ACTIVE' | 'CANCELED';
  planName?: string;
  renewalDate?: string;
}

export interface AppContextType {
  view: View;
  setView: (view: View) => void;
  logs: LogEntry[];
  addLog: (log: Omit<LogEntry, 'timestamp'>) => void;
  clearLogs: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}