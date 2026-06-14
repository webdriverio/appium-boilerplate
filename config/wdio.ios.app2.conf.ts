import { config as baseConfig } from './wdio.shared.local.appium.conf.js';
import { iosCapabilities, appiumService } from './capabilities.js';

export const config: WebdriverIO.Config = {
    ...baseConfig,

    maxInstances: 1,

    // Retry once on failure — biometric + relaunchApp sequences can flake on slower
    // simulators under load, matching the retry strategy used by the Android configs.
    specFileRetries: 1,
    specFileRetriesDelay: 5,

    // Separate Appium port so ios.app and ios.app2 run in parallel.
    port: 4724,
    services: [appiumService({ port: 4724, logFile: './logs/appium-ios-p2.log' })],

    specs: ['../tests/specs/**/app*.spec.ts'],

    capabilities: [
        iosCapabilities({
            deviceName: 'iPhone 17 Simulator',
            udid: '74B54CD8-219B-48B1-A483-4BAFD13C9A17',
            platformVersion: '26.5',
            wdaLocalPort: 8101,
        }),
    ],
};
