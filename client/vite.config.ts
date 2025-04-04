import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import qrcode from 'qrcode-terminal';
import * as os from 'node:os';

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
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: "auto",
      manifest: {
        name: 'MindEase App',
        short_name: 'MindEase',
        description: 'A mindfulness and mental wellness application',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: './', // Ensure relative path for proper PWA installation
        scope: './', // Explicitly define the scope
        orientation: 'portrait',
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/icons/icon-maskable-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: '/icons/icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      devOptions: {
        enabled: true, // Enable service worker during development
        type: 'module', // Ensure the service worker is loaded as a module
      },
      includeAssets: ['favicon.ico', 'robots.txt', 'icons/*'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg}'],
      }
    }),
    qrCodePlugin()
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    host: true, // required to expose local IP
    port: 5173,
  },
  publicDir: 'public', // Ensure static files are served from the public directory
});
