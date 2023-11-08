import { config } from '../wdio.shared.conf';

// ============
// Specs
// ============
config.specs = [
    './tests/specs/**/app*.spec.ts',
];
config.exclude = [
    // Exclude this one because the test can only be executed on emulators/simulators
    './tests/specs/**/app.biometric.login.spec.ts',
];

// =============================
// TestingBot specific config
// =============================
// User configuration
config.user = process.env.TESTINGBOT_KEY || 'TESTINGBOT_KEY';
config.key = process.env.TESTINGBOT_SECRET || 'TESTINGBOT_SECRET';
// Use testingbot service
config.services = ['testingbot'];

// ============
// Capabilities
// ============
// For all capabilities please check
// http://appium.io/docs/en/writing-running-appium/caps/#general-capabilities
config.capabilities = [
    {
        // Set URL of the application under test
        app: 'https://testingbot.com/appium/sample.apk',

        deviceName: 'Pixel 6',
        platformName: 'Android',
        version: '12.0',
    },
];

exports.config = config;
