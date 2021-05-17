import config from './wdio.shared.sauce.conf';

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

// ============
// Capabilities
// ============
// For all capabilities please check
// http://appium.io/docs/en/writing-running-appium/caps/#general-capabilities

config.capabilities = [
    {
        // For more information about the supported Sauce Labs capabilities see:
        // https://wiki.saucelabs.com/display/DOCS/Appium+Capabilities+for+Real+Device+Testing
        // Sauce Labs RDC is not yet W3C compatible, that's why we use ts-ignore
        // @ts-ignore
        deviceName: 'Samsung Galaxy S[8912].*',
        platformName: 'Android',
        automationName: 'UiAutomator2',
        phoneOnly: true,
        orientation: 'PORTRAIT',
        // Keep the device connected between tests so we don't need to wait for the cleaning process
        cacheId: 'jsy1v49pn10',
        newCommandTimeout: 240,
        idleTimeout: 180,
        maxInstances: 5,
        // The path to the app that has been uploaded to the Sauce Storage,
        // see https://wiki.saucelabs.com/display/DOCS/Application+Storage for more information
        app: 'storage:filename=wdio-demo-app-android.apk',
        appWaitActivity: 'com.wdiodemoapp.MainActivity',
        // Always default the language to a language you prefer so you know the app language is always as expected
        language: 'en',
        locale: 'en',
        // Add a name to the test
        name: 'wdio-demo-app-test',
        build: `WebdriverIO Native Demo app, Android Real Devices: ${new Date().getTime()}`
    },
];

// This port was defined in the `wdio.shared.conf.ts`
delete config.port;

exports.config = config;
