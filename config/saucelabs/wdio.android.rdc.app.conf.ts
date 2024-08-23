import { config as baseConfig } from "./wdio.shared.sauce.conf.js";

export const config: WebdriverIO.Config = {
    ...baseConfig,

    // ============
    // Specs
    // ============
    specs: ["../tests/specs/**/app*.spec.ts"],
    exclude: [
        // Exclude this one because the test can only be executed on emulators/simulators
        "../tests/specs/**/app.biometric.login.spec.ts",
    ],

    // ============
    // Capabilities
    // ============
    // For all capabilities please check
    // http://appium.io/docs/en/writing-running-appium/caps/#general-capabilities
    capabilities: [
        {
            "wdio:maxInstances": 5,
            platformName: "Android",
            // For more information about the supported Sauce Labs capabilities see:
            // https://wiki.saucelabs.com/display/DOCS/Appium+Capabilities+for+Real+Device+Testing
            // Sauce Labs RDC is not yet W3C compatible, that's why we use ts-ignore
            // @ts-ignore
            "appium:deviceName": "Samsung Galaxy S[8912].*",
            "appium:automationName": "UiAutomator2",
            "appium:orientation": "PORTRAIT",
            "sauce:options": {
                // Keep the device connected between tests so we don't need to wait for the cleaning process
                cacheId: "jsy1v49pn10",
                idleTimeout: 180,
                // Add a name to the test
                name: "wdio-demo-app-test",
                build: `WebdriverIO Native Demo app, Android Real Devices: ${new Date().getTime()}`,
            },

            "appium:newCommandTimeout": 240,
            // The path to the app that has been uploaded to the Sauce Storage,
            // see https://wiki.saucelabs.com/display/DOCS/Application+Storage for more information
            "appium:app": "storage:filename=wdio-demo-app-android.apk",
            "appium:appWaitActivity": "com.wdiodemoapp.MainActivity",
            // Always default the language to a language you prefer so you know the app language is always as expected
            "appium:language": "en",
            "appium:locale": "en",
        },
    ],
};
