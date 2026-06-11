import { config as baseConfig } from './wdio.shared.local.appium.conf.js';
import { androidCapabilities, appiumService } from './capabilities.js';

export const config: WebdriverIO.Config = {
    ...baseConfig,

    // Separate Appium port so android.app and android.app2 run in parallel.
    port: 4724,
    services: [appiumService({ port: 4724, logFile: './logs/appium-android-p2.log' })],

    specFileRetries: 1,
    specFileRetriesDelay: 5,

    specs: ['../tests/specs/**/app*.spec.ts'],

    capabilities: [
        androidCapabilities({
            deviceName: 'Pixel_9_P2',
            udid: 'emulator-5560',
        }),
    ],
};
