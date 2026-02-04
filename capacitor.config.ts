import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'traceability',
  webDir: 'www',
  server: {
    cleartext: true,
    allowNavigation: ['10.61.148.125', 'http://10.61.148.125:3000']
  }
};

export default config;
