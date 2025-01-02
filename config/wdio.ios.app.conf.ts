import { join } from "node:path";
import { config as baseConfig } from "./wdio.shared.local.appium.conf.js";

const isGhActions = process.env.GITHUB_ACTION;

export const config: WebdriverIO.Config = {
    ...baseConfig,

    // ============
    // Specs
    // ============
    specs: ["../tests/specs/**/app*.spec.ts"],

    // ============
    // Capabilities
    // ============
    // For all capabilities please check
    // http://appium.io/docs/en/writing-running-appium/caps/#general-capabilities
    capabilities: [
        {
            // The defaults you need to have in your config
            platformName: "iOS",
            "wdio:maxInstances": 1,
            // For W3C the appium capabilities need to have an extension prefix
            // This is `appium:` for all Appium Capabilities which can be found here
            // http://appium.io/docs/en/writing-running-appium/caps/

            //
            // NOTE: Change this name according to the Simulator you have created on your local machine
            "appium:deviceName": "iPhone 16 Pro",
            //
            // NOTE: Change this version according to the Simulator Version you have created on your local machine
            "appium:platformVersion": "18.2",
            "appium:orientation": "PORTRAIT",
            "appium:automationName": "XCUITest",
            // The path to the app
            "appium:app": join(
                process.cwd(),
                "apps",
                // Change this name according to the app version you downloaded
                "ios.simulator.wdio.native.app.v1.0.8.zip"
            ),
            "appium:newCommandTimeout": 240,
            // This is needed to wait for the webview context to become available
            "appium:webviewConnectTimeout": 5000,
        },
    ],
};
