import { config as baseConfig } from "./wdio.shared.conf.js";

export const config: WebdriverIO.Config = {
    ...baseConfig,

    // ============
    // Specs
    // ============
    specs: ["../tests/specs/**/browser*.spec.ts"],

    // ============
    // Capabilities
    // ============
    // For all capabilities please check
    // http://appium.io/docs/en/writing-running-appium/caps/#general-capabilities
    capabilities: [
        {
            browserName: "chrome",
        },
        {
            browserName: "firefox",
        },
        {
            browserName: "edge",
        },
        {
            "wdio:maxInstances": 1,
            browserName: "safari",
        },
    ],
};
