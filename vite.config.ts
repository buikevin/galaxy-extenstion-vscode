import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'webview-dist',
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'src/webview/index.tsx')
      },
      output: {
        entryFileNames: 'index.js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'index.css') {
            return 'index.css';
          }
          return '[name].[ext]';
        }
      }
    },
    minify: 'esbuild',
    sourcemap: true
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src/webview')
    }
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
  }
});
