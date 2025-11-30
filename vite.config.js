import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',

      includeAssets: [
        'teamfight-tactics-logo-png_seeklogo-487286.png'
      ],

      manifest: {
        name: 'TFT Set 10 Gallery',
        short_name: 'TFT Gallery',
        description: 'A lightweight PWA displaying assets, champions, and artwork from TFT Set 10.',
        theme_color: '#000000',
        background_color: '#111827',
        display: 'standalone',
        start_url: '.',

        icons: [
          {
            src: 'teamfight-tactics-logo-png_seeklogo-487286.png',
            sizes: '64x64',
            type: 'image/png'
          },
          {
            src: 'teamfight-tactics-logo-png_seeklogo-487286.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'teamfight-tactics-logo-png_seeklogo-487286.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },

      // FIX: Jangan precache file PNG/JPG yang besar
      workbox: {
        globPatterns: [
          '**/*.{js,css,html,svg}'   // hanya cache file kecil
        ],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // (opsional) naikkan limit ke 5MB
        cleanupOutdatedCaches: true,
        navigateFallback: 'index.html',
      }
    })
  ],

  server: {
    host: true
  }
})
