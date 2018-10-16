# appium-boilerplate

Boilerplate project to run Appium tests together with WebdriverIO for:

- iOS/Android Native Apps
- iOS/Android Hybrid Apps
- Android Chrome and iOS Safari browser ([check here](./README.md#automating-chrome-or-safari))

> This boilerplate uses the WebdriverIO native demo app which can be found [here](https://github.com/webdriverio/native-demo-app).
> The releases can be found and downloaded [here](https://github.com/webdriverio/native-demo-app/releases).
> Before running tests, please create a `./apps` directory, download the app and move the zip files into that directory

> Note:
> This boilerplate only handles local execution on 1 em/simulator at a time, not parallel execution. For more info about that Google on setting up a grid with Appium.

![webdriverio-demo-app-ios.ios](./docs/assets/appium-tests.gif)

## Based on
This boilerplate is currently based on:
- **WebdriverIO:** `4.13.#`
- **Appium:** `1.9.0`

Updates to the latest versions will come, see [TODO](./README.md##todo)

## Installing Appium on a local machine
See [Installing Appium on a local machine](./docs/APPIUM.md)

## Setting up Android and iOS on a local machine
To setup your loal machine to use an Android emulator and an iOS simulator see [Setting up Android and iOS on a local machine](./docs/ANDROID_IOS_SETUP.md)

## Quick start
Choose one of the following options:

1. Clone the git repo — `git clone https://github.com/webdriverio/appium-boilerplate.git`

2. Then copy the files to your project directory (all files in `/test` and the `wdio.conf`-files in the `config`-folder)

3. Merge project dev dependencies with your projects dev dependencies in your `package.json`

4. merge the scripts to your `package.json` scripts

5. Run the tests for iOS with `npm run ios.app` and for Android with `npm run android.app`

## Config
This boilerplate uses a specific config for iOS and Android, see [configs](./config/) and are based on `wdio.shared.conf.js`.
This shared config holds all the defaults so the iOS and Android configs only need to hold the capabilities and specs that are needed for running on iOS and or Android (app or browser).

## Locator strategy for native apps
The locator strategy for this boilerplate is to use `accessibilityID`'s, see also the [WebdriverIO docs](http://webdriver.io/guide/usage/selectors.html#Accessibility-ID) or this newsletter on [AppiumPro](https://appiumpro.com/editions/20).
`accessibilityID`'s make it easy to script once and run on iOS and Android because most of the apps already have some `accessibilityID`'s.

If `accessibilityID`'s can't be used and for example only XPATH is only available then the following setup could be used to make cross-platform selectors

```js
const SELECTORS = {
    WEB_VIEW_SCREEN: browser.isAndroid
        ? '*//android.webkit.WebView'
        : '*//XCUIElementTypeWebView',
};
```

## Automating Chrome or Safari
Mobile web automation is almost the same as writing tests for desktop browsers. The only difference can be found in the configuration that needs to be used.
Click [here](./config/wdio.ios.browser.conf.js) to find the config for iOS Safari and [here](./config/wdio.android.browser.conf.js)) for Android Chrome.
For Android be sure that the lastest version of Chrome is installed, see also [here](./docs/FAQ.md#i-get-the-error-no-chromedriver-found-that-can-automate-chrome-).

For this boilerplate the testcases from the [jasmine-boilerplte](https://github.com/webdriverio/jasmine-boilerplate), created by [Christian Bromann](https://github.com/christian-bromann), are used.

## FAQ
See [FAQ](./docs/FAQ.md)

## Tips and Tricks
See [Tips and Tricks](./docs/TIPS_TRICKS.md)


# TODO
- Setup configs for:
  - [x] iOS and Android app
  - [x] iOS and Android browsers
- Setup helpers for:
  - [x] WebView
  - [x] Gestures
  - [x] Native alerts
  - [x] Pickers
- Create tests for:
  - [x] WebView
  - [x] Login
  - [x] Forms
  - [x] Swipe
  - [x] Browsers
- [x] Write docs
- Update dependencies:
  - [ ] Update to work with WebdriverIO `5.#.#`
