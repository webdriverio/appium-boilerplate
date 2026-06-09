import { join } from "node:path";
import { config as baseConfig } from "./wdio.shared.local.appium.conf.js";

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
    // http://appium.io/docs/en/writing-running-appium/caps/
    capabilities: [
        {
            platformName: "iOS",
            "wdio:maxInstances": 1,

            // iPhone 17 Simulator — second parallel iOS device
            // Boot with: xcrun simctl boot 74B54CD8-219B-48B1-A483-4BAFD13C9A17
            "appium:deviceName": "iPhone 17 Simulator",
            "appium:platformVersion": "26.5",
            "appium:udid": "74B54CD8-219B-48B1-A483-4BAFD13C9A17",
            "appium:orientation": "PORTRAIT",
            "appium:automationName": "XCUITest",
            "appium:app": join(
                process.cwd(),
                "apps",
                "ios.simulator.wdio.native.app.v2.2.0.zip"
            ),
            "appium:newCommandTimeout": 240,
            // App already pre-installed; skip reinstall to avoid 30s cold-start penalty per session.
            "appium:noReset": true,
            "appium:webviewConnectTimeout": 20 * 1000,
            "appium:additionalWebviewBundleIds": ["*"],
            "appium:maxTypingFrequency": 30,
        },
    ],
};
