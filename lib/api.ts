import { Capacitor } from '@capacitor/core';

export const getApiBaseUrl = () => {
  if (Capacitor.isNativePlatform()) {
    // If running on Android emulator, use 10.0.2.2 to access host localhost
    // For production, you would use your actual production URL
    return process.env.NODE_ENV === 'production' 
      ? 'https://api.smartcampus.com' 
      : (Capacitor.getPlatform() === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000');
  }
  // Web environment
  return 'http://localhost:3000';
};
