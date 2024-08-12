import { join } from "node:path";
import { config as baseConfig } from "./wdio.shared.local.appium.conf.js";
import path from "path";
import url from "node:url";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
// We need to remove the `mochaOpts` from the `baseConfig` to have all
// Mocha references removed
const { mochaOpts, ...cleanBaseConfig } = baseConfig;

export const config: WebdriverIO.Config = {
    ...cleanBaseConfig,

    // ============
    // Specs
    // ============
    specs: ["../tests/features/**/*.feature"],
    // ============
    // Framework
    // ============
    // By default we use the Mocha framework, see the `wdio.shared.conf.ts` which is imported by `./wdio.shared.local.appium.conf.js`. For Cucumber we need to "redefine" the framework
    framework: "cucumber",
    //
    // You also need to specify where your step definitions are located.
    // See also: https://github.com/webdriverio/webdriverio/tree/main/packages/wdio-cucumber-framework#cucumberopts-options
    cucumberOpts: {
        require: [
            path.join(
                __dirname,
                "..",
                "tests",
                "steps",
                "login_and_signup_steps.ts"
            ),
        ], // <string[]> (file/dir) require files before executing features
        backtrace: false, // <boolean> show full backtrace for errors
        compiler: [], // <string[]> ("extension:module") require files with the given EXTENSION after requiring MODULE (repeatable)
        dryRun: false, // <boolean> invoke formatters without executing steps
        failFast: false, // <boolean> abort the run on first failure
        snippets: true, // <boolean> hide step definition snippets for pending steps
        source: true, // <boolean> hide source URIs
        strict: false, // <boolean> fail if there are any undefined or pending steps
        timeout: 20000, // <number> timeout for step definitions
        ignoreUndefinedDefinitions: false, // <boolean> Enable this config to treat undefined definitions as warnings.
        scenarioLevelReporter: false, // Enable this to make webdriver.io behave as if scenarios and not steps were the tests.
    },
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
            "appium:deviceName": "Pixel_7_Pro_Android_14_API_34",
            //
            // NOTE: Change this version according to the Emulator you have created on your local machine
            "appium:platformVersion": "14.0",
            "appium:orientation": "PORTRAIT",
            "appium:automationName": "UiAutomator2",
            // The path to the app
            "appium:app": join(
                process.cwd(),
                "apps",
                //
                // NOTE: Change this name according to the app version you downloaded
                "android.wdio.native.app.v1.0.8.apk"
            ),
            "appium:appWaitActivity": "com.wdiodemoapp.MainActivity",
            "appium:newCommandTimeout": 240,
        },
    ],
};
