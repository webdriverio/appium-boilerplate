const { config } = require('../wdio.shared.conf');

// ============
// Specs
// ============
config.specs = [
    './tests/specs/**/app*.spec.js',
];
config.exclude = [
    // 'path/to/excluded/files'
];

// ============
// Capabilities
// ============
// For all capabilities please check
// http://appium.io/docs/en/writing-running-appium/caps/#general-capabilities
config.capabilities = [
    {
        // Set your BrowserStack config
        'browserstack.debug': true,

        // Set URL of the application under test
        app: process.env.BROWSERSTACK_APP_ID || 'BROWSERSTACK_APP_ID',

        // Specify device and os_version for testing
        device: 'Google Pixel 3',
        os_version: '9.0',

        // Set other BrowserStack capabilities
        project: 'wdio-test-project',
        build: 'android',
        name: 'wdio-test'
    },
];

// =============================
// Browserstack specific config
// =============================
// User configuration
config.user = process.env.BROWSERSTACK_USER || 'BROWSERSTACK_USER';
config.key = process.env.BROWSERSTACK_ACCESS_KEY || 'BROWSERSTACK_ACCESS_KEY';
// Use browserstack service
config.services = ['browserstack'];

// This port was defined in the `wdio.shared.conf.js`
delete config.port;

exports.config = config;
