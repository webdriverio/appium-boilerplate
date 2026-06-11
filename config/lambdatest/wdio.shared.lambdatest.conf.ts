import { config as baseConfig } from '../wdio.shared.conf.js';

// Shared configuration for LambdaTest across all environments
export const config: WebdriverIO.Config = {
    ...baseConfig,

    // LambdaTest user credentials — no placeholder fallback so a missing
    // env var fails fast instead of sending obviously invalid credentials
    user: process.env.LT_USERNAME,
    key: process.env.LT_ACCESS_KEY,

    // LT Service
    services: ['lambdatest'],
};
