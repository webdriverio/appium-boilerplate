import { config } from './wdio.shared.conf';

//
// ======
// Appium
// ======
//
config.services = (config.services ? config.services : []).concat([
    [
        'appium',
        {
            // This will use the globally installed version of Appium
            command: 'appium',
            args: {
                // This is needed to tell Appium that we can execute local ADB commands
                // and to automatically download the latest version of ChromeDriver
                relaxedSecurity: true,
            },
        },

    ],
]);
//
// =====================
// Server Configurations
// =====================
//
config.port = 4723;

export default config;
