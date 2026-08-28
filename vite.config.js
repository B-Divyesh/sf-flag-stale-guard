import { defineConfig } from 'vite';
import { resolve } from 'node:path';
export default defineConfig({ build: { outDir: 'dist', target: 'es2022', cssCodeSplit: false, rollupOptions: { input: { main: resolve('index.html'), notFound: resolve('404.html') } } }, server: { port: 4173 } });
