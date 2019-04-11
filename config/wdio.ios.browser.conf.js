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
        deviceName: 'iPhone X',
        platformName: 'iOS',
        platformVersion: '12.1',
        orientation: 'PORTRAIT',
        maxInstances: 1,
        browserName: 'safari',
        newCommandTimeout: 240,
    },
]

exports.config = config;
