import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import qrcode from 'qrcode-terminal';
import * as os from 'node:os';
import path from 'path';

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name in interfaces) {
    const networkInterface = interfaces[name];
    if (networkInterface) {
      for (const iface of networkInterface) {
        if (iface.family === 'IPv4' && !iface.internal) {
          return iface.address;
        }
      }
    }
  }
}

function qrCodePlugin() {
  return {
    name: 'vite-plugin-mobile-qr',
    configureServer(server: any) {
      const ip = getLocalIP();
      const port = server.config.server.port || 5173;
      const url = `http://${ip}:${port}`;
      qrcode.generate(url, { small: true });
      console.log(`\n🔗 Scan to open on mobile: ${url}\n`);
    }
  };
}

export default defineConfig({
  plugins: [
    react(),
    qrCodePlugin()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  // optimizeDeps: {
  //   exclude: ['lucide-react'],
  // },
  server: {
    host: true, // required to expose local IP
    port: 5173,
  },
  publicDir: 'public', // Ensure static files are served from the public directory
});
