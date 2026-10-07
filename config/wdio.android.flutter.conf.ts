import { join } from 'node:path';
import { config as baseConfig } from './wdio.shared.local.appium.conf.js';

export const config: WebdriverIO.Config = {
    ...baseConfig,

    // ============
    // Specs
    // ============
    specs: [
        '../tests/specs/**/app.flutter*.spec.ts'
    ],

    // ============
    // Capabilities
    // ============
    capabilities: [
        {
            platformName: 'Android',
            'wdio:maxInstances': 1,
            'appium:deviceName': 'Pixel_8_Pro_Android_15_API_35',
            'appium:platformVersion': '15.0',
            'appium:orientation': 'PORTRAIT',
            'appium:automationName': 'Flutter',
            'appium:app': join(
                process.cwd(),
                'apps',
                'flutter-demo-app.apk'
            ),
            'appium:newCommandTimeout': 240,
        },
    ],
};
