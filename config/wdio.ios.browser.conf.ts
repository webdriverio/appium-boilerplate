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
        browserName: 'safari',
        platformName: 'iOS',
        maxInstances: 1,
        // For W3C the appium capabilities need to have an extension prefix
        // This is `appium:` for all Appium Capabilities which can be found here
        // http://appium.io/docs/en/writing-running-appium/caps/
        'appium:deviceName': 'iPhone 12',
        'appium:platformVersion': '14.5',
        'appium:orientation': 'PORTRAIT',
        'appium:automationName': 'XCUITest',
        'appium:newCommandTimeout': 240,
    },
];

exports.config = config;
