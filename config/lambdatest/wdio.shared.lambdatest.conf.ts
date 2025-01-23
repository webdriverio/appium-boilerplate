import { config as baseConfig } from '../wdio.shared.conf.js';

// Shared configuration for LambdaTest across all environments
export const config: WebdriverIO.Config = {
    ...baseConfig,

    // LambdaTest user credentials
    user: process.env.LT_USERNAME || "YOUR_USERNAME",
    key: process.env.LT_ACCESS_KEY || "YOUR_ACCESS_KEY",
    path: "/wd/hub",

    // Default settings for all environments
    logLevel: 'info',
    bail: 0,
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    services: ['lambdatest'],
    framework: 'mocha',
    reporters: ['spec'],
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000,
    },
};
