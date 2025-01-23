import { config as baseConfig } from './wdio.shared.lambdatest.conf.js';

export const config: WebdriverIO.Config = {
    ...baseConfig,

    // LambdaTest specific configuration
    hostname: "hub.lambdatest.com",

    // Test specs
    specs: ["../../tests/specs/**/browser*.spec.ts"],

    // Capabilities for iOS simulators
    maxInstances: 1,
    capabilities: [{
        "lt:options": {
            "w3c": true,
            "platformName": "ios",
            "deviceName": "iPhone 16",
            "appiumVersion": "2.11.3",
            "platformVersion": "18.1",
            "build": "Appium iOS Simulator",
            "name": "Chrome Tests",
            "project": "WDIO-appium-ios",
        },
    }],
};
