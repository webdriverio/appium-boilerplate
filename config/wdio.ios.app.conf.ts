import { config as baseConfig } from './wdio.shared.local.appium.conf.js';
import { iosCapabilities } from './capabilities.js';

export const config: WebdriverIO.Config = {
    ...baseConfig,

    // iOS simulators serialise XCUITest accessibility-framework access.
    // Running multiple sessions concurrently causes timeouts.
    maxInstances: 1,

    // Retry once on failure — biometric + relaunchApp sequences can flake on slower
    // simulators under load, matching the retry strategy used by the Android configs.
    specFileRetries: 1,
    specFileRetriesDelay: 5,

    specs: ['../tests/specs/**/app*.spec.ts'],

    capabilities: [
        iosCapabilities({
            deviceName: 'Appium_Test_iPhone',
            udid: 'DA4738CD-5409-4F15-B6DB-3A5EC116AA79',
            platformVersion: '26.4',
            wdaLocalPort: 8100,
        }),
    ],
};
