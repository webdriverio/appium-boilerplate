import { config as baseConfig } from './wdio.shared.sauce.conf.js';
const buildName = `WebdriverIO Native Demo app, iOS Simulators: ${new Date().getTime()}`;

export const config: WebdriverIO.Config = {
    ...baseConfig,

    // ============
    // Specs
    // ============
    specs: [
        '../../tests/specs/**/app*.spec.ts',
    ],

    // ============
    // Capabilities
    // ============
    // For all capabilities please check
    // http://appium.io/docs/en/writing-running-appium/caps/#general-capabilities
    //
    // For configuring an Emulator please check
    // https://wiki.saucelabs.com/display/DOCS/Platform+Configurator#/
    capabilities: [
        {
            // The defaults you need to have in your config
            platformName: 'iOS',
            'appium:deviceName': 'iPhone 14 Simulator',
            'appium:platformVersion': '16.2',
            'appium:automationName': 'XCUITest',
            'appium:orientation': 'PORTRAIT',
            // The path to the app
            'appium:app': 'storage:filename=wdio-demo-app-ios.zip',
            // Read the reset strategies very well, they differ per platform, see
            // http://appium.io/docs/en/writing-running-appium/other/reset-strategies/
            'appium:newCommandTimeout': 240,
            // Sauce Labs specific options
            'sauce:options': {
                // Group builds by build name
                build: buildName,
            },
        },
    ],

    maxInstances: 25
};
