exports.config = {
    // ====================
    // Runner and framework
    // Configuration
    // ====================
    runner: 'local',
    framework: 'jasmine',
    jasmineNodeOpts: {
        // Updated the timeout to 30 seconds due to possible longer appium calls
        // When using XPATH
        defaultTimeoutInterval: 30000,
    },
    sync: true,
    logLevel: 'silent',
    deprecationWarnings: true,
    bail: 0,
    baseUrl: 'http://the-internet.herokuapp.com',
    waitforTimeout: 10000,
    connectionRetryTimeout: 90000,
    connectionRetryCount: 3,
    reporters: ['dot', 'spec'],

    // ====================
    // Appium Configuration
    // ====================
    // Using the wdio-appium-service here, just make sure you've installed
    // Appium on your local machine for example global instead of as
    // a project dependency with `npm install -g appium`
    services: ['appium'],
    // Some default settings, see
    // https://github.com/rhysd/wdio-appium-service
    // for the rest of the settings
    appium: {
        args: {
            address: '127.0.0.1',
            commandTimeout: '11000',
        },
    },
    // Default port for Appium
    port: 4723,
    maxInstances: 1,

    // ====================
    // Some hooks
    // ====================
    beforeSession: function (config, capabilities, specs) {
        require('babel-register');
    },
    before: function (capabilities, specs) {
        /**
         * Add a command to the device object to check if the keyboard is shown
         */
        browser.addCommand('isKeyboardShown', () =>
            browser.requestHandler.create({
                path: `/session/${browser.session().sessionId}/appium/device/is_keyboard_shown`,
                method: 'GET',
            }).then(result => result.value));
    },
};
