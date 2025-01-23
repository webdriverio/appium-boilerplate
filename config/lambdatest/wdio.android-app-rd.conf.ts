import { config as baseConfig } from '../wdio.shared.conf.js';

export const config: WebdriverIO.Config = {
    ...baseConfig,

    user: process.env.LT_USERNAME || "YOUR_USERNAME",
    key: process.env.LT_ACCESS_KEY || "YOUR_ACCESS_KEY",
    path: "/wd/hub",
    hostname: "mobile-hub.lambdatest.com",
    port: 80,

    // ============
    // Specs
    // ============
    specs: ["../../tests/specs/**/app*.spec.ts"],
    exclude: [
        // Exclude this one because the test can only be executed on emulators/simulators
        "../../tests/specs/**/app.biometric.login.spec.ts",
    ],

    maxInstances: 1,
    // LambdaTest Capabilities Generator
    // For more details, visit: https://www.lambdatest.com/capabilities-generator/
    capabilities: [{
        "lt:options": {
            "w3c": true,
            "platformName": "android",
            "deviceName": "Pixel 3",
            "platformVersion": "11",
            // To upload your app, refer to the following documentation:
            // https://www.lambdatest.com/support/docs/application-setup-via-api/#upload-your-application
            "app": "lt://<>",
            "isRealMobile": true
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
