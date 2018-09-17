const path = require('path');
const config = require('./wdio.shared.conf').config;

// ============
// Capabilities
// ============
config.capabilities = [
    {
        automationName: 'UiAutomator2',
        deviceName: 'Nexus_5_7.1.1',
        platformName: 'Android',
        platformVersion: '7.1.1',
        orientation: 'PORTRAIT',
        app: path.join(process.cwd(), './apps/Android-NativeDemoApp-0.1.0.apk'),
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
