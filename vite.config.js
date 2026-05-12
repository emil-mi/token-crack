import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    base: '/token-crack/',
    build: {
        outDir: 'build',
        sourcemap: true,
    },
    plugins: [react()],
    server: {
        port: 3000,
        open: false,
    },
    test: {
        globals: true,
        environment: 'jsdom',
    },
});
