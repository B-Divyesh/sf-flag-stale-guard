import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  build: {
    // This is the site root consumed by the static deployment work order.
    outDir: 'dist/site',
    target: 'es2022',
    cssCodeSplit: false,
    rollupOptions: {
      input: {
        main: resolve('index.html'),
        notFound: resolve('404.html')
      }
    }
  },
  server: { port: 4173 },
  preview: { port: 4173 }
});
