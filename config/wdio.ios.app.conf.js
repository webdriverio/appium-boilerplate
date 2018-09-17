const path = require('path');
const config = require('./wdio.shared.conf').config;

// ============
// Capabilities
// ============
config.capabilities = [
    {
        deviceName: 'iPhone 6',
        platformName: 'iOS',
        platformVersion: '11.1',
        orientation: 'PORTRAIT',
        app: path.join(process.cwd(), './apps/iOS-NativeDemoApp-0.2.0.zip'),
        noReset: true,
        newCommandTimeout: 240,
    },
];

exports.config = config;
