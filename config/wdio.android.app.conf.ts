import { config as baseConfig } from './wdio.shared.local.appium.conf.js';
import { androidCapabilities } from './capabilities.js';

export const config: WebdriverIO.Config = {
    ...baseConfig,

    // Retry once on failure — biometrics + app-relaunch sequences can exceed the
    // wait timeout on slower emulators under parallel load without being genuine bugs.
    specFileRetries: 1,
    specFileRetriesDelay: 5,

    specs: ['../tests/specs/**/app*.spec.ts'],

    capabilities: [
        androidCapabilities({
            deviceName: 'Pixel_9_P1',
            udid: 'emulator-5558',
        }),
    ],
};
