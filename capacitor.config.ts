import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.branchsense.app',
  appName: 'BranchSense',
  webDir: 'dist', // Vite's build output folder
  server: {
    // During development, point the Android WebView at your live backend/frontend
    // so you don't have to rebuild the APK every time you change code.
    // Comment this out for production builds (it will then load the bundled dist/ files).
    // url: 'http://192.168.1.5:5173',
    // cleartext: true,
  },
};

export default config;
