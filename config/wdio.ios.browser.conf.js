const { config } = require('./wdio.shared.conf');

// ============
// Specs
// ============
config.specs = [
    './tests/specs/**/browser*.spec.js',
];

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
        platformVersion: '11.4',
        browserName: 'safari',
        newCommandTimeout: 240,
    },
];

// ====================
// Appium Configuration
// ====================
// Default port for Appium
config.port = 4723;

exports.config = config;
