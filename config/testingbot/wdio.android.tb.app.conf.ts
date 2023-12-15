import { config as baseConfig } from '../wdio.shared.conf';

export const config: WebdriverIO.Config = {
    ...baseConfig,

    // ============
    // Specs
    // ============
    specs: [
        './tests/specs/**/app*.spec.ts',
    ],
    exclude: [
        // Exclude this one because the test can only be executed on emulators/simulators
        './tests/specs/**/app.biometric.login.spec.ts',
    ],

    // =============================
    // TestingBot specific config
    // =============================
    // User configuration
    user: process.env.TESTINGBOT_KEY || 'TESTINGBOT_KEY',
    key: process.env.TESTINGBOT_SECRET || 'TESTINGBOT_SECRET',
    // Use testingbot service
    services: ['testingbot'],

    // ============
    // Capabilities
    // ============
    // For all capabilities please check
    // http://appium.io/docs/en/writing-running-appium/caps/#general-capabilities
    capabilities: [
        {
            // Set URL of the application under test
            app: 'https://testingbot.com/appium/sample.apk',

            deviceName: 'Pixel 6',
            platformName: 'Android',
            version: '12.0',
        },
    ],
};
