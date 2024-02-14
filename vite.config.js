import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// Function to resolve the source directory path
function resolveSrc() {
  const srcPath = fileURLToPath(new URL('./src', import.meta.url));
  return srcPath;
}

export default defineConfig({
  build: {
    assetsDir: 'home',
  },
  plugins: [
    vue(),
  ],
  // Resolve aliases
  resolve: {
    alias: {
      '@': resolveSrc(), // Using the resolveSrc function to get the source directory path
    },
  },
});