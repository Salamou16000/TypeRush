import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon-192.png', 'icons/icon-512.png'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
      },
      manifest: {
        name: 'TypeRush',
        short_name: 'TypeRush',
        description: 'Improve your typing speed and accuracy with TypeRush.',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],

screenshots: [
  {
    src: '/screenshots/desktop.png',
    sizes: '1280x720',
    type: 'image/png',
    form_factor: 'wide',
    label: 'TypeRush desktop interface',
  },
  {
    src: '/screenshots/mobile.png',
    sizes: '720x1280',
    type: 'image/png',
    label: 'TypeRush mobile interface',
  },
],
id: '/',

      },
    }),
  ],
})