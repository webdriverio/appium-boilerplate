import config from './wdio.shared.local.appium.conf';

// ============
// Specs
// ============
config.specs = [
    './e2e/tests/specs/**/browser*.spec.ts',
];

// ============
// Capabilities
// ============
config.capabilities = [
    {
        browserName: 'chrome',
        maxInstances: 1,
    },
];

config.services = [
    ['chromedriver', {
        logFileName: 'wdio-chromedriver.log',
        outputDir: './logs',
        chromedriverCustomPath: 'chromedriver',
    }]
];

exports.config = config;
