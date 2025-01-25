import { config as baseConfig } from './wdio.shared.lambdatest.conf.js';

// Configuration for iOS Browser on Real Device
export const config: WebdriverIO.Config = {
    ...baseConfig,

    // LambdaTest specific configuration
    hostname: "mobile-hub.lambdatest.com",

    // Test specs
    specs: ["../../tests/specs/**/browser*.spec.ts"],
    maxInstances: 1,

    // Capabilities for iOS real devices
    capabilities: [{
        "lt:options": {
            "w3c": true,
            "platformName": "ios",
            "deviceName": "iPhone 16",
            "platformVersion": "18",
            "build": "Appium iOS Real Device",
            "name": "Chrome Tests",
            "project": "WDIO-appium-ios",
            "isRealMobile": true,
        },
    }],
};
