import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'traceability',
  webDir: 'www',
  server: {
    cleartext: true,
    allowNavigation: ['10.61.148.125', 'http://10.61.148.125:3000']
  },
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: '917076566370-kq0nc8ajdmesdo32js88cki1tfasfqtq.apps.googleusercontent.com',
      forceCodeForRefreshToken: false
    }
  }
};

export default config;
