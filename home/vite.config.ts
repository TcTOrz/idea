import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/',
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Idea Projects',
        short_name: 'Idea Projects',
        description: 'TcTOrz 的创意实验室 - 前端工具与 Web 应用集合',
        theme_color: '#4f46e5',
        background_color: '#f3f4f6',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'favicon.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          },
          {
            src: 'favicon.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        navigateFallbackDenylist: [
          /^\/focus-station/,
          /^\/json-toolkit/,
          /^\/color-wizard/,
          /^\/regex-visualizer/,
          /^\/diff-checker/,
          /^\/css-effects-generator/,
          /^\/image-lab/,
          /^\/timestamp-converter/,
          /^\/ads.txt/,
          /^\/robots.txt/,
          /^\/sitemap.xml/
        ]
      }
    })
  ],
})
