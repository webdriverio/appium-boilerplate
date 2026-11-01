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
            platformName: 'iOS',
            'wdio:maxInstances': 1,
            'appium:deviceName': 'iPhone 16 Pro',
            'appium:platformVersion': '18.5',
            'appium:orientation': 'PORTRAIT',
            'appium:automationName': 'Flutter',
            'appium:app': join(
                process.cwd(),
                'apps',
                'flutter-demo-app.zip'
            ),
            'appium:newCommandTimeout': 240,
        },
    ],
};
