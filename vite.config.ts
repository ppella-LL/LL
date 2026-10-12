import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    // maplibre-gl is large; raise the warning limit instead of manually
    // chunking it (manual chunks can break its web worker). It still loads
    // only inside the lazy page chunks that render a map.
    chunkSizeWarningLimit: 1200,
  },
});
