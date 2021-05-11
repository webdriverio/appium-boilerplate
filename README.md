# appium-boilerplate

> **NOTE:**
> This boilerplate is for Webdriver V6, if you need a boilerplate for:\
> - V6 please click [here](https://github.com/webdriverio/appium-boilerplate/tree/v6)
> - V5 please click [here](https://github.com/webdriverio/appium-boilerplate/tree/v5)
> - V4 please click [here](https://github.com/webdriverio/appium-boilerplate/tree/v4)

Boilerplate project to run Appium tests together with WebdriverIO for:

- iOS/Android Native Apps
- iOS/Android Hybrid Apps
- Android Chrome and iOS Safari browser ([check here](./README.md#automating-chrome-or-safari))

> This boilerplate uses the WebdriverIO native demo app which can be found [here](https://github.com/webdriverio/native-demo-app).
> The releases can be found and downloaded [here](https://github.com/webdriverio/native-demo-app/releases), this boilerplate works with
> version `0.4.0` or higher.
> Before running tests, please create a `./apps` directory, download the apps and move the files into that directory

> **Note:**
> This boilerplate only handles local execution on 1 em/simulator at a time, not parallel execution. For more info about that Google on
> setting up a grid with Appium.

![webdriverio-demo-app-ios.ios](./docs/assets/appium-tests.gif)

## Based on
This boilerplate is currently based on:
- **WebdriverIO:** `7.##.#`
- **Appium:** `1.20.#`

## Prerequisites
### Installing Appium on a local machine
See [Installing Appium on a local machine](./docs/APPIUM.md)

### Setting up Android and iOS on a local machine
To setup your local machine to use an Android emulator and an iOS simulator see
[Setting up Android and iOS on a local machine](./docs/ANDROID_IOS_SETUP.md)

## Quick start
Choose one of the following options:

1. Clone the git repo — `git clone https://github.com/webdriverio/appium-boilerplate.git`

2. Then copy the files to your project directory (all files in `/tests` and the `wdio.conf`-files in the `config`-folder)

3. Merge project dev dependencies with your projects dev dependencies in your `package.json`

4. merge the scripts to your `package.json` scripts

5. Run the tests for:
   - **App:**
       - Android with `npm run android.app`
       - iOS with `npm run ios.app`
   - **Browser:**
       - Android with `npm run android.browser`
       - iOS with `npm run ios.browser`

## Configuration files
This boilerplate uses a specific config for iOS and Android, see [configs](./config/). The configs are based on a shared config
[`wdio.shared.conf.ts`](./config/wdio.shared.conf.ts).
This shared config holds **all the defaults** so the iOS and Android configs only need to hold the capabilities and specs that are needed
for running on iOS and or Android (app or browser).

Please check the [`wdio.shared.conf.ts`](./config/wdio.shared.conf.ts)-file for the minimal configuration options. Notes are added for why
a different value has been selected in comparison to the default values WebdriverIO provides.

Since we do not have Appium installed as part of this package we are going to use the globally installed version of Appium. This is
configured in [`wdio.shared.local.appium.conf.ts`](./config/wdio.shared.local.appium.conf.ts).

## Locator strategy for native apps
The locator strategy for this boilerplate is to use `accessibilityID`'s, see also the
[WebdriverIO docs](https://webdriver.io/docs/selectors#accessibility-id) or this newsletter on
[AppiumPro](https://appiumpro.com/editions/20).
`accessibilityID`'s make it easy to script once and run on iOS and Android because most of the apps already have some `accessibilityID`'s.

If `accessibilityID`'s can't be used, and for example only XPATH is available, then the following setup could be used to make cross-platform
selectors

```js
const SELECTORS = {
    WEB_VIEW_SCREEN: browser.isAndroid
        ? '*//android.webkit.WebView'
        : '*//XCUIElementTypeWebView',
};
```

## Native App Tests
### Form components
The Forms-tab holds some components that might be a challenge during automation:

- Input fields
- Switches
- Dropdowns / Pickers
- Native alerts

The tests and used page objects hopefully explain what you need to do to make this work and can be found
[here](./tests/specs/app.forms.spec.ts).

### Navigation
There are 2 types of navigation tests that explained in this boilerplate.

1. [Tab Bar](./tests/specs/app.tab.bar.navigation.spec.ts)
1. [Deep Links](./tests/specs/app.deep.link.navigation.spec.ts)

The most interesting test here will be the [Deep Links](./tests/specs/app.deep.link.navigation.spec.ts) because this might speed up your own
tests if your app supports Deep Links. Check the code and the `openDeepLinkUrl()` method in the [`Utils.ts`](./tests/helpers/Utils.ts)-file
to see how this works.

> **PRO TIP:** If you are automating iOS apps and you can use Deep Links, then you might want to try adding the capability
> `autoAcceptAlerts:true` when you start the iOS device. This capability will automatically accept all alerts, also the alert that will
> appear when you want to open your deep link in Safari.
>
> If you ware going to use this capability, then don't forget to remove the last few lines in the
> [`openDeepLinkUrl()`](./tests/helpers/Utils.ts)-method, see the comments in the method

## Automating Chrome or Safari
Mobile web automation is almost the same as writing tests for desktop browsers. The only difference can be found in the configuration that
needs to be used. Click [here](config/wdio.ios.browser.conf.ts) to find the config for iOS Safari and
[here](config/wdio.android.browser.conf.ts) for Android Chrome.
For Android be sure that the latest version of Chrome is installed, see also
[here](./docs/FAQ.md#i-get-the-error-no-chromedriver-found-that-can-automate-chrome-). Our
[`wdio.shared.local.appium.conf.ts`](./config/wdio.shared.local.appium.conf.ts) uses the `relaxedSecurity: true` argument from Appium which
will allow Appium to automatically download the latest ChromeDriver.

For this boilerplate the testcases from the [jasmine-boilerplate](https://github.com/webdriverio/jasmine-boilerplate), created by
[Christian Bromann](https://github.com/christian-bromann), are used.

## Cloud vendors
### Sauce Labs Real Device Cloud
This boilerplate now also provides a setup for testing with the Real Device Cloud (RDC) of Sauce Labs. Please check the
[SauceLabs](./config/saucelabs)-folder to see the setup for iOS and Android.

> With the latest version of WebdriverIO (`5.4.13` and higher) the iOS and Android config holds:
> - automatic US or EU RDC cloud selection by providing a `region` in the config, see the
> [iOS](./config/saucelabs/wdio.ios.rdc.app.conf.js) and the [Android](./config/saucelabs/wdio.ios.rdc.app.conf.js) configs
> - automatic update of the test status in the RDC cloud without using a custom script

Make sure you install the latest version of the `@wdio/sauce-service` with

```shell
$ npm install --save-dev @wdio/sauce-service
```

and add `services: ['sauce'],` to the config. If no `region` is provided it will automatically default to the US-RDC cloud.
If you provide `region: 'us'` or `region: 'eu'` it will connect to the US or the EU RDC cloud

There are 2 scripts that can be used, see the [`package.json`](./package.json), to execute the tests in the cloud:

    // For iOS
    $ npm run ios.sauce.rdc.app

    // For Android
    $ npm run android.sauce.rdc.app

### BrowserStack
This boilerplate provides a setup for testing with BrowserStack. Please check the [BrowserStack](./config/browserstack)-folder to see the
setup for iOS and Android.

Make sure you install the latest version of the `@wdio/browserstack-service` with

```shell
$ npm install --save-dev @wdio/browserstack-service
```

There are 2 scripts that can be used, see the [`package.json`](./package.json), to execute the tests in the cloud:

    // For iOS
    $ npm run ios.browserstack.app

    // For Android
    $ npm run android.browserstack.app

## FAQ
See [FAQ](./docs/FAQ.md)

## Tips and Tricks
See [Tips and Tricks](./docs/TIPS_TRICKS.md)
