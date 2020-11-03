const { config } = require('../wdio.shared.conf');
const browserstack = require('browserstack-local');

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
        'browserstack.local': true,
        'browserstack.debug': true,

        // Set URL of the application under test
        app: process.env.BROWSERSTACK_APP_ID || 'BROWSERSTACK_APP_ID',

        // Specify device and os_version for testing
        device: 'iPhone 11 Pro',
        os_version: '13',

        // Set other BrowserStack capabilities
        project: 'wdio-test-project',
        build: 'ios',
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
config.services = [
    ['browserstack', {
        browserstackLocal: true
    }]
];

// Prepare browserstack local before test execution
config.onPrepare = (config, capabilities) => {
    console.log('Connecting local...');
    return new Promise((resolve, reject) => {
        exports.bs_local = new browserstack.Local();
        exports.bs_local.start({ key: config.key }, (error) => {
            if (error) return reject(error);
            console.log('Connected. Now testing...');
            resolve();
        });
    });
};

// Stop browserstack local after end of test
config.onComplete = (capabilties, specs) => {
    console.log('Closing local tunnel...');
    return new Promise((resolve, reject) => {
        exports.bs_local.stop((error) => {
            if (error) return reject(error);
            console.log('Stopped BrowserStackLocal');
            resolve();
        });
    });
};

// This port was defined in the `wdio.shared.conf.js`
delete config.port;

exports.config = config;
