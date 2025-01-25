import { config as baseConfig } from '../wdio.shared.conf.js';

// Shared configuration for LambdaTest across all environments
export const config: WebdriverIO.Config = {
    ...baseConfig,

    // LambdaTest user credentials
    user: process.env.LT_USERNAME || "YOUR_USERNAME",
    key: process.env.LT_ACCESS_KEY || "YOUR_ACCESS_KEY",

    // LT Service
    services: ['lambdatest'],
};
