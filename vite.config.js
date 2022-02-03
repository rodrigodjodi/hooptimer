import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],  
      manifest: {
        name: 'Hoop Timer App',
        short_name: 'Hoop Timer',
        description: 'Installable big timer web app with 2 minute warning and 10 seconds countdown.',
        theme_color: '#000000',
        scope: ".",
        display: "standalone",
        orientation: "any",
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          }
        ]
      }
    })
  ],
  server: {
    port:3333
  }
})
