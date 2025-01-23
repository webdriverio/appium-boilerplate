import { config as baseConfig } from '../wdio.shared.conf.js';

export const config: WebdriverIO.Config = {
    ...baseConfig,

    user: process.env.LT_USERNAME || "YOUR_USERNAME",
    key: process.env.LT_ACCESS_KEY || "YOUR_ACCESS_KEY",
    path: "/wd/hub",
    hostname: "hub.lambdatest.com",
    port: 80,

    // ============
    // Specs
    // ============
    specs: [
        '../../tests/specs/**/browser*.spec.ts',
    ],

    maxInstances: 10,
    // ============
    // Capabilities
    // ============
    // For all capabilities please check
    // https://www.lambdatest.com/capabilities-generator/
    capabilities: [{
        "lt:options": {
            "w3c": true,
            "platformName": "ios",
            "deviceName": "iPhone 16",
            "appiumVersion": "2.11.3",
            "platformVersion": "18.1",
            "build": "Appium IOS Simulator",
            "name": "Chrome Tests",
            "project": "WDIO-appium-ios"
        }
    }],

    logLevel: 'info',
    bail: 0,
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    services: ['lambdatest'],
    framework: 'mocha',
    reporters: ['spec'],
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    },
}
