import { config as baseConfig } from './wdio.shared.lambdatest.conf.js';

// Configuration for Android Browser on Emulators
export const config: WebdriverIO.Config = {
    ...baseConfig,

    // LambdaTest specific configuration
    hostname: "hub.lambdatest.com",

    // Test specs
    specs: ["../../tests/specs/**/browser*.spec.ts"],
    maxInstances: 1,

    // Capabilities for Android emulators
    capabilities: [{
        "lt:options": {
            "w3c": true,
            "platformName": "android",
            "deviceName": "Pixel 2",
            "appiumVersion": "1.22.3",
            "platformVersion": "10",
            "build": "Appium Android Virtual Device",
            "name": "Chrome Tests",
            "project": "WDIO-appium-android",
        },
    }],
};
