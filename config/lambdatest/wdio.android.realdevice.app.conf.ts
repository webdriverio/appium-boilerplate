import { config as baseConfig } from './wdio.shared.lambdatest.conf.js';

// Configuration for Android App on Real Device
export const config: WebdriverIO.Config = {
    ...baseConfig,

    // LambdaTest specific configuration
    hostname: "mobile-hub.lambdatest.com",

    // Test specs
    specs: ["../../tests/specs/**/app*.spec.ts"],

    // Exclude tests that only work on emulators/simulators
    exclude: [
        "../../tests/specs/**/app.biometric.login.spec.ts",
    ],
    maxInstances: 1,

    // Capabilities for Android real devices
    capabilities: [{
        "lt:options": {
            "w3c": true,
            "platformName": "android",
            "deviceName": "Pixel 3",
            "platformVersion": "11",
            // To upload your app, refer to the following documentation:
            // https://www.lambdatest.com/support/docs/application-setup-via-api/#upload-your-application
            "app": "lt://<>",
            "isRealMobile": true,
        },
    }],
};
