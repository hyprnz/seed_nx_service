import { defineConfig } from 'vite';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig({
    root: __dirname,
    cacheDir: '../../node_modules/.vite/libs/validation',

    plugins: [nxViteTsPaths()],

    test: {
        watch: false,
        globals: true,
        environment: 'node',
        include: ['src/**/*.{test,spec,unit}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
        reporters: ['default'],
        coverage: {
            reportsDirectory: '../../reports/coverage/libs/validation',
            provider: 'v8'
        }
    }
});
