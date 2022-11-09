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
        browserName: 'safari',
        maxInstances: 1,
    },
];

config.services = [
    ['safaridriver', {
        logFileName: 'wdio-safaridriver.log',
        outputDir: './logs',
    }]
];

exports.config = config;
