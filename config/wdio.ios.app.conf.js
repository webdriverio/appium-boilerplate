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
        app: path.join(process.cwd(), './apps/iOS-NativeDemoApp-0.1.0.zip'),
        noReset: true,
        newCommandTimeout: 240,
    },
];

config.appium = {
    args: {
        address: '127.0.0.1',
        commandTimeout: '11000',
    },
};

config.port = 4723;

exports.config = config;
