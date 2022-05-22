import config from './wdio.shared.sauce.conf';
const buildName = `WebdriverIO Native Demo app, iOS Simulators: ${new Date().getTime()}`;

// ============
// Specs
// ============
config.specs = [
    './tests/specs/**/app*.spec.ts',
];

// ============
// Capabilities
// ============
// For all capabilities please check
// http://appium.io/docs/en/writing-running-appium/caps/#general-capabilities
//
// For configuring an Emulator please check
// https://wiki.saucelabs.com/display/DOCS/Platform+Configurator#/
config.capabilities = [
    // iOS iPhone 14.3 TouchID
    {
        // The defaults you need to have in your config
        platformName: "iOS",
        "appium:deviceName": "iPhone 8 Simulator",
        "appium:platformVersion": "14.3",
        "appium:orientation": "PORTRAIT",
        // The path to the app
        "appium:app": "storage:filename=wdio-demo-app-ios.zip",
        // Read the reset strategies very well, they differ per platform, see
        // http://appium.io/docs/en/writing-running-appium/other/reset-strategies/
        "appium:noReset": true,
        "appium:newCommandTimeout": 240,
        // Always default the language to a language you prefer so you know the app language is always as expected
        "appium:language": "en",
        "appium:locale": "en",
        // Sauce Labs specific options
        "sauce:options": {
            // Group builds by build name
            build: buildName,
        },
    },

    // iOS iPhone 13.4 TouchID
    {
        // The defaults you need to have in your config
        platformName: "iOS",
        "appium:deviceName": "iPhone 8 Simulator",
        "appium:platformVersion": "13.4",
        "appium:orientation": "PORTRAIT",
        // The path to the app
        "appium:app": "storage:filename=wdio-demo-app-ios.zip",
        // Read the reset strategies very well, they differ per platform, see
        // http://appium.io/docs/en/writing-running-appium/other/reset-strategies/
        "appium:noReset": true,
        "appium:newCommandTimeout": 240,
        // Always default the language to a language you prefer so you know the app language is always as expected
        "appium:language": "en",
        "appium:locale": "en",
        // Sauce Labs specific options
        "sauce:options": {
            // Group builds by build name
            build: buildName,
        },
    },

    // iOS iPhone 13.4 FaceID
    {
        // The defaults you need to have in your config
        platformName: "iOS",
        "appium:deviceName": "iPhone 11 Simulator",
        "appium:platformVersion": "13.4",
        "appium:orientation": "PORTRAIT",
        // The path to the app
        "appium:app": "storage:filename=wdio-demo-app-ios.zip",
        // Read the reset strategies very well, they differ per platform, see
        // http://appium.io/docs/en/writing-running-appium/other/reset-strategies/
        "appium:noReset": true,
        "appium:newCommandTimeout": 240,
        // Always default the language to a language you prefer so you know the app language is always as expected
        "appium:language": "en",
        "appium:locale": "en",
        // Sauce Labs specific options
        "sauce:options": {
            // Group builds by build name
            build: buildName,
        },
    },

    // iOS iPhone 14.3 FaceID
    {
        // The defaults you need to have in your config
        platformName: "iOS",
        "appium:deviceName": "iPhone 11 Simulator",
        "appium:platformVersion": "14.3",
        "appium:orientation": "PORTRAIT",
        // The path to the app
        "appium:app": "storage:filename=wdio-demo-app-ios.zip",
        // Read the reset strategies very well, they differ per platform, see
        // http://appium.io/docs/en/writing-running-appium/other/reset-strategies/
        "appium:noReset": true,
        "appium:newCommandTimeout": 240,
        // Always default the language to a language you prefer so you know the app language is always as expected
        "appium:language": "en",
        "appium:locale": "en",
        // Sauce Labs specific options
        "sauce:options": {
            // Group builds by build name
            build: buildName,
        },
    },
];

config.maxInstances = 25;

exports.config = config;
