import { defineConfig } from "vite";
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  base: "/THREEjs_III/",
  // add explicit aliases for Node.js modules to use our custom polyfills
  resolve: {
    alias: {
      buffer: path.resolve(__dirname, './src/polyfills/buffer.js'), // custom buffer polyfill
      fs: path.resolve(__dirname, './src/polyfills/fs.js'), // dummy fs polyfill for browser environment
      process: path.resolve(__dirname, './src/polyfills/process.js'), // dummy process polyfill
    },
  },
  // Increase chunk size warning limit for THREE.js applications with physics/shaders
  build: {
    chunkSizeWarningLimit: 1000, // Default is 500 kB; THREE.js apps often exceed this
  },
});