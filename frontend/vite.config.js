import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (id.includes('react') || id.includes('react-router-dom')) return 'react-vendors'
          if (id.includes('framer-motion') || id.includes('gsap')) return 'animation'
          if (id.includes('three') || id.includes('@react-three')) return 'graphics'
          if (id.includes('recharts')) return 'charts'
          if (id.includes('@tanstack/react-query') || id.includes('axios')) return 'data'
          return 'vendor'
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Increase warning limit
  },
})
  
