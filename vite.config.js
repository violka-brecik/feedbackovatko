import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.js',
      name: 'FeedbackTool',
      fileName: 'tool',
      formats: ['iife']
    },
    rollupOptions: {
      external: [],
    }
  },
  test: {
    environment: 'jsdom',
    globals: true
  }
})
