import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'traceability',
  webDir: 'www',
  server: {
    cleartext: true,
    allowNavigation: ['192.168.1.200', 'http://192.168.1.200:3000']
  }
};

export default config;
