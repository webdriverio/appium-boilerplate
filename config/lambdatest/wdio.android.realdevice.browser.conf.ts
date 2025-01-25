import { config as baseConfig } from './wdio.shared.lambdatest.conf.js';

// Configuration for Android Browser on Real Device
export const config: WebdriverIO.Config = {
    ...baseConfig,

    // LambdaTest specific configuration
    hostname: "mobile-hub.lambdatest.com",

    // Test specs
    specs: ["../../tests/specs/**/browser*.spec.ts"],
    maxInstances: 1,

    // Capabilities for Android real devices
    capabilities: [{
        "lt:options": {
            "w3c": true,
            "platformName": "android",
            "deviceName": "Pixel 3",
            "platformVersion": "11",
            "build": "Appium Android Real Device",
            "name": "Chrome Tests",
            "project": "WDIO-appium-android",
            "isRealMobile": true,
        },
    }],
};
