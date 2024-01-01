import { join } from 'node:path';
import { config as baseConfig } from './wdio.shared.local.appium.conf.js';

export const config: WebdriverIO.Config = {
    ...baseConfig,

    // ============
    // Specs
    // ============
    specs: ['../tests/specs/**/app*.spec.ts'],

    // ============
    // Capabilities
    // ============
    // For all capabilities please check
    // http://appium.io/docs/en/writing-running-appium/caps/#general-capabilities
    capabilities: [
        {
            // The defaults you need to have in your config
            platformName: 'iOS',
            maxInstances: 1,
            // For W3C the appium capabilities need to have an extension prefix
            // This is `appium:` for all Appium Capabilities which can be found here
            // http://appium.io/docs/en/writing-running-appium/caps/
            'appium:deviceName': 'iPhone 15',
            'appium:platformVersion': '17.2',
            'appium:orientation': 'PORTRAIT',
            'appium:automationName': 'XCUITest',
            // The path to the app
            'appium:app': join(
                process.cwd(),
                'apps',
                // Change this name according to the app version you downloaded
                'ios.simulator.wdio.native.app.v1.0.8.zip'
            ),
            'appium:newCommandTimeout': 240,
        }
    ]
};
