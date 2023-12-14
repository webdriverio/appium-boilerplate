import { config as baseConfig } from '../wdio.shared.conf.js';

export const config: WebdriverIO.Config = {
    ...baseConfig,
    // ============
    // Specs
    // ============
    specs: [
        '../tests/specs/**/app*.spec.js',
    ],
    exclude: [
        // Exclude this one because the test can only be executed on emulators/simulators
        '../tests/specs/**/app.biometric.login.spec.js',
    ],

    // =============================
    // Browserstack specific config
    // =============================
    // User configuration
    user: process.env.BROWSERSTACK_USER || 'BROWSERSTACK_USER',
    key: process.env.BROWSERSTACK_ACCESS_KEY || 'BROWSERSTACK_ACCESS_KEY',
    // Use browserstack service
    services: ['browserstack'],

    // ============
    // Capabilities
    // ============
    // For all capabilities please check
    // http://appium.io/docs/en/writing-running-appium/caps/#general-capabilities
    capabilities: [
        {
            // Set URL of the application under test
            'appium:app': process.env.BROWSERSTACK_APP_ID || 'BROWSERSTACK_APP_ID',

            'bstack:options': {
                // Set your BrowserStack config
                debug: true,

                // Specify device and os_version for testing
                device: 'Google Pixel 3',
                os_version: '9.0',

                // Set other BrowserStack capabilities
                projectName: 'wdio-test-project',
                buildName: 'android',
                sessionName: 'wdio-test'
            }
        },
    ] as WebdriverIO.Capabilities[]
};
