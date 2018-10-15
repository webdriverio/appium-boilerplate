const config = require('./wdio.shared.conf').config;

// ============
// Specs
// ============
config.specs = [
    './tests/specs/**/browser*.spec.js'
];

// ============
// Capabilities
// ============
// For all capabilities please check
// http://appium.io/docs/en/writing-running-appium/caps/#general-capabilities
config.capabilities = [
    {
        // The defaults you need to have in your config
        automationName: 'UiAutomator2',
        deviceName: 'Nexus_5_7.1.1',
        platformName: 'Android',
        platformVersion: '7.1.1',
        browserName: 'chrome',
        // Add this option to prevent the anoying "Welcome"-message
        chromeOptions: {
            args: ['--no-first-run'],
        },
        newCommandTimeout: 240,
    },
];

exports.config = config;
