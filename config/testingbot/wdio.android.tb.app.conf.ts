import { config as baseConfig } from '../wdio.shared.conf.js';

export const config: WebdriverIO.Config = {
    ...baseConfig,

    // ============
    // Specs
    // ============
    specs: [
        '../../tests/specs/**/app*.spec.ts',
    ],
    exclude: [
        // Exclude this one because the test can only be executed on emulators/simulators
        '../../tests/specs/**/app.biometric.login.spec.ts',
    ],

    // =============================
    // TestingBot specific config
    // =============================
    user: process.env.TESTINGBOT_KEY || 'TESTINGBOT_KEY',
    key: process.env.TESTINGBOT_SECRET || 'TESTINGBOT_SECRET',
    services: ['testingbot'],

    // ============
    // Capabilities
    // ============
    // For all capabilities please check
    // http://appium.io/docs/en/writing-running-appium/caps/#general-capabilities
    capabilities: [
        {
            platformName: 'Android',
            'appium:deviceName': 'Pixel 6',
            'appium:platformVersion': '12.0',
            'appium:automationName': 'UiAutomator2',
            'appium:app': 'https://testingbot.com/appium/sample.apk',
            'appium:newCommandTimeout': 240,
            'appium:noReset': false,
        },
    ],
};
