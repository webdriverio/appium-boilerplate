import { join } from "node:path";
import { config as baseConfig } from "./wdio.shared.local.appium.conf.js";

export const config: WebdriverIO.Config = {
    ...baseConfig,

    // Retry once on failure — biometrics + app-relaunch sequences can exceed the wait
    // timeout on slower emulators under parallel load without being genuine test bugs.
    specFileRetries: 1,
    specFileRetriesDelay: 5,

    // ============
    // Specs
    // ============
    specs: ["../tests/specs/**/app*.spec.ts"],

    // ============
    // Capabilities
    // ============
    // For all capabilities please check
    // https://github.com/appium/appium-uiautomator2-driver
    capabilities: [
        {
            // The defaults you need to have in your config
            platformName: "Android",
            "wdio:maxInstances": 1,
            // For W3C the appium capabilities need to have an extension prefix
            // This is `appium:` for all Appium Capabilities which can be found here

            //
            // NOTE: Change this name according to the Emulator you have created on your local machine
            "appium:deviceName": "Pixel_9_P1",
            "appium:udid": "emulator-5558",
            //
            // NOTE: Change this version according to the Emulator you have created on your local machine
            "appium:platformVersion": "16.0",
            "appium:orientation": "PORTRAIT",
            "appium:automationName": "UiAutomator2",
            // The path to the app
            "appium:app": join(
                process.cwd(),
                "apps",
                //
                // NOTE: Change this name according to the app version you downloaded
                "android.wdio.native.app.v2.2.0.apk"
            ),
            "appium:appWaitActivity": "com.wdiodemoapp.MainActivity",
            "appium:newCommandTimeout": 240,
            "appium:autoGrantPermissions": true,
            "appium:noReset": false,
        },
    ],
};
