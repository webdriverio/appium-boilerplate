import type { Options } from '@wdio/types';
import { config as baseConfig } from '../wdio.shared.conf.js';

export const config: WebdriverIO.Config = {
    ...baseConfig,

    // ========
    // Services
    // ========
    services: [
        ...baseConfig.services || [],
        [
            'sauce',
            {
                // For Sauce Options see https://webdriver.io/docs/sauce-service#sauce-service-options
            },
        ],
    ],

    // =================
    // Service Providers
    // =================
    user: process.env.SAUCE_USERNAME,
    key: process.env.SAUCE_ACCESS_KEY,
    // If you run your tests on Sauce Labs you can specify the region you want to run your tests
    // in via the `region` property. Available short handles for regions are `us` (default) and `eu`.
    // These regions are used for the Sauce Labs Virtual cloud and the Sauce Labs Real Device Cloud.
    // If you don't provide the region, it defaults to `us`.
    region: process.env.REGION as Options.SauceRegions || 'us',

    // Increase for real device support
    connectionRetryTimeout: 180000,

    // Retry count for spec file failures
    specFileRetries: 2,

    // reduce logs
    logLevel: 'silent',
};
