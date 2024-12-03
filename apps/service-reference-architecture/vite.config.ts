/// <reference types='vitest' />
import { defineConfig } from 'vite';

import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig({
    root: __dirname,
    cacheDir: '../../node_modules/.vite/apps/service-reference-architecture',
    plugins: [nxViteTsPaths()],
    test: {
        watch: false,
        globals: true,
        environment: 'node',
        include: ['src/**/*.{test,spec,unit}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
        reporters: ['default']
        // Commented out until we can get coverage to work correctly
        // coverage: {
        //     exclude: ['src/socialTests/**/*', 'src/**/*.{test,spec,unit}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
        //     reportsDirectory: '../../reports/coverage/apps/service-reference-architecture',
        //     provider: 'v8'
        // }
    }
});
