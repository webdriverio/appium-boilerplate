const path = require('path');
const config = require('./wdio.shared.conf').config;

// ============
// Capabilities
// ============
// For all capabilities please check
// http://appium.io/docs/en/writing-running-appium/caps/#general-capabilities
config.capabilities = [
    {
        // The defaults you need to have in your config
        deviceName: 'iPhone 6',
        platformName: 'iOS',
        platformVersion: '11.1',
        orientation: 'PORTRAIT',
        // The path to the app
        app: path.join(process.cwd(), './apps/iOS-NativeDemoApp-0.2.0.zip'),
        // Read the reset strategies very well, they differ per platform, see
        // http://appium.io/docs/en/writing-running-appium/other/reset-strategies/
        noReset: true,
        newCommandTimeout: 240,
    },
];

exports.config = config;
