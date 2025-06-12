const API_BASE_URL = 'https://195.200.30.205/api/cftools/server';

export interface ServerStatus {
  serverAddress: string;
  serverPort: number;
  isOnline: boolean;
  isOffline: boolean;
  totalSlots: number;
  onlinePlayers: number;
  queueSize: number;
}

export interface ServerInfo {
  uptimeSeconds: number;
  uptimeMinutes: number;
  uptimeHours: number;
  nextRestart: string;
  gameTime: string;
}

export const serverApi = {
  async getServerStatus(): Promise<ServerStatus> {
    console.log('🔄 Fetching server status from:', `${API_BASE_URL}/status`);
    try {
      const response = await fetch(`${API_BASE_URL}/status`, {
        method: 'GET',
        headers: {
          'Accept': 'text/plain',
        },
      });
      
      console.log('📡 Server status response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ Server status data received:', data);
      return data;
    } catch (error) {
      console.error('❌ Failed to fetch server status:', error);
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        console.error('🔒 This appears to be a network/SSL issue. Check certificate settings.');
      }
      throw error;
    }
  },

  async getServerInfo(): Promise<ServerInfo> {
    console.log('🔄 Fetching server info from:', `${API_BASE_URL}/info`);
    try {
      const response = await fetch(`${API_BASE_URL}/info`, {
        method: 'GET',
        headers: {
          'Accept': 'text/plain',
        },
      });
      
      console.log('📡 Server info response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ Server info data received:', data);
      return data;
    } catch (error) {
      console.error('❌ Failed to fetch server info:', error);
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        console.error('🔒 This appears to be a network/SSL issue. Check certificate settings.');
      }
      throw error;
    }
  }
};
