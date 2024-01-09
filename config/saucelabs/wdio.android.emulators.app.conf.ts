import { config as baseConfig } from './wdio.shared.sauce.conf.js';

const buildName = `WebdriverIO Native Demo app, Android Emulators: ${new Date().getTime()}`;

export const config: WebdriverIO.Config = {
    ...baseConfig,

    // ============
    // Specs
    // ============
    specs: [
        '../../tests/specs/**/app*.spec.ts',
    ],

    // ============
    // Capabilities
    // ============
    // For all capabilities please check
    // https://github.com/appium/appium-uiautomator2-driver
    //
    // For configuring an Emulator please check
    // https://saucelabs.com/products/platform-configurator
    capabilities: [
        {
            // The defaults you need to have in your config
            platformName: 'Android',
            'appium:deviceName': 'Google Pixel 7 Pro GoogleAPI Emulator',
            'appium:platformVersion': '13.0',
            'appium:automationName': 'UiAutomator2',
            'appium:orientation': 'PORTRAIT',
            // The path to the app
            'appium:app': 'storage:filename=wdio-demo-app-android.apk',
            'appium:appWaitActivity': 'com.wdiodemoapp.MainActivity',
            'appium:newCommandTimeout': 240,
            // Sauce Labs specific options
            'sauce:options':{
                // Group builds by build name
                build: buildName,
                // Provide the Appium version
                appiumVersion: '2.0.0'
            },
        },
    ],
    maxInstances: 25,
};
