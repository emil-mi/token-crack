import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

// CRA → Vite migration. Notes:
//  * `base` keeps asset URLs under /token-crack/ for GitHub Pages.
//  * `outDir: 'build'` preserves the `gh-pages -d build` deploy script.
//  * Several existing source files use JSX inside .js files — the esbuild
//    loader override lets Vite parse them without renaming.
export default defineConfig({
    base: '/token-crack/',
    build: {
        outDir: 'build',
        sourcemap: true,
    },
    plugins: [react({include: /\.(jsx|js)$/})],
    esbuild: {
        loader: 'jsx',
        include: /src\/.*\.jsx?$/,
        exclude: [],
    },
    optimizeDeps: {
        esbuildOptions: {
            loader: {'.js': 'jsx'},
        },
    },
    server: {
        port: 3000,
        open: false,
    },
    test: {
        globals: true,
        environment: 'jsdom',
    },
});
