/**
 * ESLint flat config (ESLint 9+).
 *
 * Replicates the rules from the legacy .eslintrc.cjs in native flat-config
 * format.  Kept intentionally minimal — only the rules that were in the
 * original config are carried over.
 */
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import wdioPlugin from 'eslint-plugin-wdio';

/** WDIO globals (driver, $, $$, browser) available in all test files. */
const wdioGlobals = {
    driver: 'readonly',
    browser: 'readonly',
    $: 'readonly',
    $$: 'readonly',
    // WebdriverIO injects expect — let it pass without no-undef errors
    expect: 'readonly',
};

/** Node + browser globals available in config files. */
const nodeGlobals = {
    require: 'readonly',
    module: 'writable',
    process: 'readonly',
    __dirname: 'readonly',
    __filename: 'readonly',
    console: 'readonly',
    setTimeout: 'readonly',
    clearTimeout: 'readonly',
    document: 'readonly',
};

/** Style + quality rules shared across JS and TS files. */
const sharedRules = {
    semi: ['error', 'always'],
    indent: [2, 4],
    'no-multiple-empty-lines': [2, { max: 1, maxEOF: 1 }],
    'array-bracket-spacing': ['error', 'never'],
    'brace-style': ['error', '1tbs', { allowSingleLine: true }],
    camelcase: ['error', { properties: 'never' }],
    'comma-spacing': ['error', { before: false, after: true }],
    'no-lonely-if': 'error',
    'no-else-return': 'error',
    'no-tabs': 'error',
    'no-trailing-spaces': ['error', {
        skipBlankLines: false,
        ignoreComments: false,
    }],
    quotes: ['error', 'single', { avoidEscape: true }],
    'unicode-bom': ['error', 'never'],
    'object-curly-spacing': ['error', 'always'],
    'keyword-spacing': ['error'],
    'require-atomic-updates': 0,
    'no-unexpected-multiline': 0,
};

export default [
    // ── Config files (JS/TS) ──────────────────────────────────────────────────
    {
        files: ['config/**/*.{js,ts}'],
        plugins: {
            '@typescript-eslint': tsPlugin,
            wdio: wdioPlugin,
        },
        languageOptions: {
            parser: tsParser,
            parserOptions: { ecmaVersion: 2017, sourceType: 'module' },
            globals: { ...nodeGlobals, ...wdioGlobals },
        },
        rules: {
            ...sharedRules,
            'no-undef': 'off',
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': 'error',
        },
    },

    // ── Test files (TypeScript) ───────────────────────────────────────────────
    {
        files: ['tests/**/*.ts'],
        plugins: {
            '@typescript-eslint': tsPlugin,
            wdio: wdioPlugin,
        },
        languageOptions: {
            parser: tsParser,
            parserOptions: { ecmaVersion: 2017, sourceType: 'module' },
            globals: { ...nodeGlobals, ...wdioGlobals },
        },
        // Apply the wdio recommended rules set
        rules: {
            ...wdioPlugin.configs.recommended.rules,
            ...sharedRules,
            // TypeScript overrides
            'no-undef': 'off',
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': 'error',
            'no-redeclare': 'off',
        },
    },
];
