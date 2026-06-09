import { join } from "node:path";
import { config as baseConfig } from "./wdio.shared.local.appium.conf.js";

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
    // https://github.com/appium/appium-uiautomator2-driver
    capabilities: [
        {
            platformName: "Android",
            "wdio:maxInstances": 1,

            // Pixel_9_P2 — second parallel Android device (port 5560)
            // Start with: ~/Library/Android/sdk/emulator/emulator -avd Pixel_9_P2 -port 5560 -no-window -no-audio
            "appium:deviceName": "Pixel_9_P2",
            "appium:udid": "emulator-5560",
            "appium:platformVersion": "16.0",
            "appium:orientation": "PORTRAIT",
            "appium:automationName": "UiAutomator2",
            "appium:app": join(
                process.cwd(),
                "apps",
                "android.wdio.native.app.v2.2.0.apk"
            ),
            "appium:appWaitActivity": "com.wdiodemoapp.MainActivity",
            "appium:newCommandTimeout": 240,
            "appium:autoGrantPermissions": true,
        },
    ],
};
