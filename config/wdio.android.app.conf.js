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
        app: path.join(process.cwd(), './apps/Android-NativeDemoApp-0.2.0.apk'),
        noReset: true,
        newCommandTimeout: 240,
    },
];

exports.config = config;
