import { config as baseConfig } from './wdio.shared.local.appium.conf.js';

export const config: WebdriverIO.Config = {
    ...baseConfig,

    // ============
    // Specs
    // ============
    specs: [
        '../tests/specs/**/browser*.spec.ts',
    ],

    // ============
    // Capabilities
    // ============
    // For all capabilities please check
    // http://appium.io/docs/en/writing-running-appium/caps/#general-capabilities
    capabilities: [
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
            'appium:automationName': 'UiAutomator2',
            'appium:orientation': 'PORTRAIT',
            'appium:newCommandTimeout': 240,
        },
    ]
};
