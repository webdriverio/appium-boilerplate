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
            platformName: 'Android',
            browserName: 'chrome',
            'wdio:maxInstances': 1,
            'wdio:enforceWebDriverClassic': true,
            'appium:deviceName': 'Pixel_9_P1',
            'appium:udid': 'emulator-5558',
            'appium:platformVersion': '16.0',
            'appium:automationName': 'UiAutomator2',
            'appium:orientation': 'PORTRAIT',
            'appium:newCommandTimeout': 240,
            'appium:noReset': false,
        },
    ],
};
