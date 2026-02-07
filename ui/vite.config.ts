import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// Backend port - can be overridden via VITE_API_PORT env var
const apiPort = process.env.VITE_API_PORT || '8888'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React core
          'vendor-react': ['react', 'react-dom'],
          // Data fetching
          'vendor-query': ['@tanstack/react-query'],
          // Flow/graph visualization (largest dependency)
          'vendor-flow': ['@xyflow/react', 'dagre'],
          // Terminal emulator
          'vendor-xterm': ['@xterm/xterm', '@xterm/addon-fit', '@xterm/addon-web-links'],
          // UI components - Radix UI
          'vendor-radix': [
            '@radix-ui/react-checkbox',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-label',
            '@radix-ui/react-separator',
            '@radix-ui/react-slot',
            '@radix-ui/react-switch',
          ],
          // Markdown rendering
          'vendor-markdown': ['react-markdown', 'remark-gfm'],
          // Icons and utilities
          'vendor-utils': [
            'lucide-react',
            'canvas-confetti',
            'class-variance-authority',
            'clsx',
            'tailwind-merge',
          ],
        },
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: `http://127.0.0.1:${apiPort}`,
        changeOrigin: true,
      },
      '/ws': {
        target: `ws://127.0.0.1:${apiPort}`,
        ws: true,
      },
    },
  },
})
