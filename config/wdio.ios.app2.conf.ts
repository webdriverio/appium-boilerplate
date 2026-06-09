import { join } from "node:path";
import { config as baseConfig } from "./wdio.shared.local.appium.conf.js";

export const config: WebdriverIO.Config = {
    ...baseConfig,

    maxInstances: 1,

    // Separate Appium port so ios.app and ios.app2 can run in parallel without conflicts
    port: 4724,
    services: [
        ['appium', {
            args: {
                relaxedSecurity: true,
                log: './logs/appium-ios-p2.log',
                port: 4724,
            },
        }],
    ],

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
            "appium:webviewConnectTimeout": 20 * 1000,
            "appium:additionalWebviewBundleIds": ["*"],
            "appium:maxTypingFrequency": 30,
        },
    ],
};
