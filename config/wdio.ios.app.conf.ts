import { join } from "node:path";
import { config as baseConfig } from "./wdio.shared.local.appium.conf.js";

const isGhActions = process.env.GITHUB_ACTION;

export const config: WebdriverIO.Config = {
    ...baseConfig,

    // iOS simulators use XCUITest which serializes accessibility-framework access.
    // Running multiple sessions concurrently against one simulator causes timeouts.
    maxInstances: 1,

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
            "appium:deviceName": "Appium_Test_iPhone",
            //
            // NOTE: Change this version according to the Simulator Version you have created on your local machine
            "appium:platformVersion": "26.4",
            "appium:udid": "DA4738CD-5409-4F15-B6DB-3A5EC116AA79",
            "appium:orientation": "PORTRAIT",
            "appium:automationName": "XCUITest",
            // The path to the app
            "appium:app": join(
                process.cwd(),
                "apps",
                // Change this name according to the app version you downloaded
                "ios.simulator.wdio.native.app.v2.2.0.zip"
            ),
            "appium:newCommandTimeout": 240,
            // App already pre-installed; skip reinstall to avoid 30s cold-start penalty per session.
            "appium:noReset": true,
            // Webview detection capabilities for iOS 18.x
            // This is needed to wait for the webview context to become available
            "appium:webviewConnectTimeout": 20 * 1000,
            // Add process bundle IDs to match webviews (iOS uses process-{bundleId} format)
            // Using wildcard to match all webview processes, or specify: ["process-wdiodemoapp", "process-org.wdiodemoapp"]
            "appium:additionalWebviewBundleIds": ["*"],
            // There are some issues when typing that not all keys are sent. This is a workaround to slow down the typing.
            "appium:maxTypingFrequency": 30,
        },
    ],
};
