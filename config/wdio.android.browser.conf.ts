import config from './wdio.shared.local.appium.conf';

// ============
// Specs
// ============
config.specs = [
    './tests/specs/**/browser*.spec.ts',
];

// ============
// Capabilities
// ============
// For all capabilities please check
// http://appium.io/docs/en/writing-running-appium/caps/#general-capabilities
config.capabilities = [
    {
        // The defaults you need to have in your config
        platformName: 'Android',
        browserName: 'chrome',
        maxInstances: 1,
        // For W3C the appium capabilities need to have an extension prefix
        // http://appium.io/docs/en/writing-running-appium/caps/
        // This is `appium:` for all Appium Capabilities which can be found here
        'appium:deviceName': 'Pixel_3_10.0',
        'appium:platformVersion': '10.0',
        'appium:orientation': 'PORTRAIT',
        'appium:newCommandTimeout': 240,
    },
];

exports.config = config;
