import globals from 'globals';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
// import pluginReact from "eslint-plugin-react";

export default [
    {
        files: ['**/*.{js,mjs,cjs,mts,ts,jsx,tsx}'],
        languageOptions: { globals: { ...globals.browser, ...globals.node } },
        ignores: ['node_modules', 'dist', '.nx', '.vscode', '.idea']
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        rules: { '@typescript-eslint/no-explicit-any': 'off' }
    }
];
