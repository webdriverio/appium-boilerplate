const { config } = require('../wdio.shared.conf');
const SauceLabs = require('./helpers/SauceLabs');

// =========================
// Sauce RDC specific config
// =========================
config.protocol = 'https';
// For using the EU RDC cloud
config.host = 'eu1.appium.testobject.com';
// For using the US RDC cloud, just remove the comments and comment the EU url
// config.host = 'us1.appium.testobject.com';
config.port = 443;
config.path = '/wd/hub';
config.services = [];

// ==============================================
// Update the testjob in the cloud after finished
// ==============================================
config.after = (result) => new SauceLabs().updateJobStatus(browser.session().sessionId, result === 0);

exports.config = config;
