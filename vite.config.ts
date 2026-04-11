import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/*.png', 'music/*.mp3'],
      manifest: {
        name: 'WeatherScan',
        short_name: 'WeatherScan',
        description: 'Local weather at a glance — a modern take on the classic WeatherScan channel.',
        theme_color: '#003366',
        background_color: '#001133',
        display: 'standalone',
        orientation: 'landscape',
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.open-meteo\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'open-meteo-cache',
              expiration: { maxAgeSeconds: 300 },
            },
          },
          {
            urlPattern: /^https:\/\/api\.weather\.gov\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'nws-cache',
              expiration: { maxAgeSeconds: 300 },
            },
          },
          {
            urlPattern: /^https:\/\/api\.rainviewer\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'rainviewer-cache',
              expiration: { maxAgeSeconds: 300 },
            },
          },
        ],
      },
    }),
  ],
})
