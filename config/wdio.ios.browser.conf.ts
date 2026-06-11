import { config as baseConfig } from './wdio.shared.local.appium.conf.js';

export const config: WebdriverIO.Config = {
    ...baseConfig,

    // ============
    // Specs
    // ============
    specs: ['../tests/specs/**/browser*.spec.ts'],

    // ============
    // Capabilities
    // ============
    capabilities: [
        {
            browserName: 'safari',
            platformName: 'iOS',
            'wdio:maxInstances': 1,
            'appium:deviceName': 'Appium_Test_iPhone',
            'appium:udid': 'DA4738CD-5409-4F15-B6DB-3A5EC116AA79',
            'appium:platformVersion': '26.4.1',
            'appium:orientation': 'PORTRAIT',
            'appium:automationName': 'XCUITest',
            'appium:newCommandTimeout': 240,
            'appium:noReset': false,
        },
    ],
};
