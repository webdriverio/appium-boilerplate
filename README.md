# appium-boilerplate

> **NOTE:**
> This boilerplate is for Webdriver V7 where the tests are written with `async`/`await` and TypeScript.\
> If you need a boilerplate for sync mode then check the following:
> - V7 (TypeScript) please click [here](https://github.com/webdriverio/appium-boilerplate/tree/sync-mode)
> - V6 (JavaScript) please click [here](https://github.com/webdriverio/appium-boilerplate/tree/v6)
> - V5 (JavaScript) please click [here](https://github.com/webdriverio/appium-boilerplate/tree/v5)
> - V4 (JavaScript) please click [here](https://github.com/webdriverio/appium-boilerplate/tree/v4)

Boilerplate project to run Appium tests together with WebdriverIO for:

- iOS/Android Native Apps
- iOS/Android Hybrid Apps
- Android Chrome and iOS Safari browser ([check here](./README.md#automating-chrome-or-safari))

> This boilerplate uses the WebdriverIO native demo app which can be found [here](https://github.com/webdriverio/native-demo-app).

> **Note:**
> This boilerplate only handles local execution on 1 em/simulator at a time, not parallel execution. For more info about that Google on setting up a grid with Appium.


## Based on
This boilerplate is currently based on:
- **WebdriverIO:** `7.##.#`
- **Appium:** `1.22.#`

## Installation

1. Running `git clone https://github.com/webdriverio/appium-boilerplate.git`
2. Running `npm install`
3. Installing Appium on a local machine [here](./docs/APPIUM.md)
4. Setting up Android and iOS on a local machine [here](./docs/ANDROID_IOS_SETUP.md)
5. Making demo app available. Create a `./apps` directory. Download the app files (.app / .apk) with version >= `0.4.0`
[here](https://github.com/webdriverio/native-demo-app/releases). Move the files into the directory `apps`.
6. Running tests `npm run android.app` or `npm run android.app`


## How to implement in your project
Choose one of the following options:

1. Clone the git repo — `git clone https://github.com/webdriverio/appium-boilerplate.git`
2. Then copy the files to your project directory (all files in `/tests` and the `wdio.conf`-files in the `config`-folder)
3. Merge project dev dependencies with your projects dev dependencies in your `package.json`
4. Merge the scripts to your `package.json` scripts
5. Run the tests, see [Native App Tests](#native-app-tests) or [Automating Chrome of Safari](#automating-chrome-or-safari).

## Configuration files
This boilerplate uses a specific config for iOS and Android, see [configs](./config). The configs are based on a shared config
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

> **NOTE:** If you look into the screen/page-objects you might see that a lot of selectors are made private, meaning you can use the
> elements in the spec-file itself. This has been done on purpose because one of the *best practices* is to remove all interactions from
> your spec files and implement the interactions in the page objects. This will make it easier to maintain for the future and easier to
> refactor if new interaction methods will be added or names will be adjusted.

## Native App Tests
All tests can be executed on te devices as configured in [`wdio.android.app.conf.ts`](./config/wdio.android.app.conf.ts) or
[`wdio.ios.app.conf.ts`](./config/wdio.ios.app.conf.ts). Please check the below tests on what they do or on how to run them separately.

        // For Android local execution
        npm run android.app

        // For iOS local execution
        npm run ios.app


### Drag And Drop
Drag and Drop an element can be a complex gesture to automate with Appium. The demo app has a simple puzzle that hopefully makes it easier
and fun to understand how to implement a drag and drop in WebdriverIO. The test can be found [here](./tests/specs/app.drag.and.drop.spec.ts)
and the drag and drop implementation can be found in [this](./tests/screenobjects/DragScreen.ts)-file.
This file will now only hold the [`touchAction`](https://webdriver.io/docs/api/browser/touchAction/) way of using the drag and drop Gesture.
The `touchPerform` is the *old* JSONWP way of implementing a gesture and is not W3C compatible. The `touchAction` is the new official W3C
implementation of a gesture.

You can run the single test with the following commands

        // For Android local execution
        npm run android.app -- --spec=tests/specs/app.drag.and.drop.spec.ts

        // For iOS local execution
        npm run ios.app -- --spec=tests/specs/app.drag.and.drop.spec.ts

### Form components
The Forms-tab holds some components that might be a challenge during automation:

- Input fields
- Switches
- Dropdowns / Pickers
- Native alerts

The tests and used page objects hopefully explain what you need to do to make this work and can be found
[here](./tests/specs/app.forms.spec.ts).

You can run the single test with the following commands

        // For Android local execution
        npm run android.app -- --spec=tests/specs/app.forms.spec.ts

        // For iOS local execution
        npm run ios.app -- --spec=tests/specs/app.forms.spec.ts

### Login with Biometric support
The Login screen holds a simple implementation of a Login and SignUp form. This boilerplate holds 2 different test-files for the Login
screen.

- [Default Login/Sign Up](./tests/specs/app.login.spec.ts)
- [Login through Touch-/FaceID or FingerPrint (Biometric Support)](./tests/specs/app.biometric.login.spec.ts)

The last one can be very interesting because it will give you an idea what you need to do when you need to log in with Touch-/FaceID or
FingerPrint. The [`app.biometric.login.spec.ts`](./tests/specs/app.biometric.login.spec.ts) will also enable Touch-/FaceID if needed
automatically for you for **Android Emulators** or **iOS Simulators**. It covers almost all platform versions.

> **NOTE:** The methods rely on the fact that the Android Emulator or iOS Simulator have English as the default language. If you have set up
> your test devices with a different language you might need to change certain selectors and or texts for the selectors.

You can run the single test with the following commands

        // For Android local execution
        npm run android.app -- --spec=tests/specs/app.login.spec.ts
        npm run android.app -- --spec=tests/specs/app.biometric.login.spec.ts

        // For iOS local execution
        npm run ios.app -- --spec=tests/specs/app.login.spec.ts
        npm run ios.app -- --spec=tests/specs/app.biometric.login.spec.ts

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

You can run the single test with the following commands

        // For Android local execution
        npm run android.app -- --spec=tests/specs/app.tab.bar.navigation.spec.ts
        npm run android.app -- --spec=tests/specs/app.deep.link.navigation.spec.ts

        // For iOS local execution
        npm run ios.app -- --spec=tests/specs/app.tab.bar.navigation.spec.ts
        npm run ios.app -- --spec=tests/specs/app.deep.link.navigation.spec.ts

### Swiping
Swiping is basically a movement with your finger on the screen that has a starting position on the screen, an x-, and y-coordinate and an
end position, also an x-, and y-coordinate. The starting position can be seen as the first time you touch the screen, the initial *press*.
The end position can be seen as the time you release the screen. If you translate this to steps you will get:

1. Press your finger on the screen on starting position
1. Move your finger to the end position
1. Release your finger when you are on the end position

The [Swipe](./tests/specs/app.swipe.spec.ts)-test will be an example on how to do that. It uses a
[Gesture](./tests/helpers/Gestures.ts)-helper that might be useful for you in the future.

If you want to know more about Gestures and how to automate them, then we would advise you to watch
[this presentation "Swiping your way through Appium by Wim Selles"](https://youtu.be/oAJ7jwMNFVU).

You can run the single test with the following commands

        // For Android local execution
        npm run android.app -- --spec=tests/specs/app.swipe.spec.ts

        // For iOS local execution
        npm run ios.app -- --spec=tests/specs/app.swipe.spec.ts

### WebViews
The app has a WebView that will automatically load the WebdriverIO documentation page. This boilerplate holds 2 test files:

1. [Interact within a WebView with CSS Selectors](./tests/specs/app.webview.spec.ts).
   *You will also find a test that interacts between a WebView and the Native part of the app.*
1. [Automate a WebView based on Native Selectors](./tests/specs/app.webview.xpath.spec.ts). This test will compare the execution time of:

    - automating the WebView by **NOT** switching to the WebView (by using native selectors).
    - automating the WebView by **SWITCHING** to the WebView.

   Check the console for load time differences. An example time could look like this
   ```log
    // Android
    [0-0] RUNNING in Android - /tests/specs/app.webview.xpath.spec.ts
    [0-0] Test time for using XPATH It took 0.799 seconds.
    [0-0] Test time for switching to the WebView It took 0.238 seconds.
    [0-0] PASSED in Android - /tests/specs/app.webview.xpath.spec.ts

    // iOS
    [0-0] RUNNING in iOS - /tests/specs/app.webview.xpath.spec.ts
    [0-0] Test time for using XPATH It took 3.125 seconds.
    [0-0] Test time for switching to the WebView It took 1.443 seconds.
    [0-0] PASSED in iOS - /tests/specs/app.webview.xpath.spec.ts
   ```

You will also find a [WebView](./tests/helpers/WebView.ts)-helper with hopefully useful methods that can help you automate a Hybrid App.
Keep in the back of your mind that for *simplicity* of the Demo app only one WebView is used. This is also used in the WebView-helper.

More information about **Automating Hybrid Applications with Appium** and more complex WebViews can be found in
[this webinar](https://youtu.be/_mPCRxplBfo) recording.

You can run the single test with the following commands

        // For Android local execution
        npm run android.app -- --spec=tests/specs/app.webview.spec.ts
        npm run android.app -- --spec=tests/specs/app.webview.xpath.spec.ts

        // For iOS local execution
        npm run ios.app -- --spec=tests/specs/app.webview.spec.ts
        npm run ios.app -- --spec=tests/specs/app.webview.xpath.spec.ts

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
### Sauce Labs
If you want to run the Native App tests on Sauce Labs you need to do 2 things:

- Add the [Sauce Service](#add-sauce-service) to your project
- Upload the apps to the [Sauce Labs Storage](#upload-apps-to-sauce-storage)

When the above has been executed you can follow the steps in:

- [Run app tests on the Sauce Labs Real Device Cloud](#run-app-tests-on-the-sauce-labs-real-device-cloud)
- [Run app tests on the Sauce Labs Emulators and Simulators](#run-app-tests-on-the-sauce-labs-emulators-and-simulators)

#### Add Sauce Service
Make sure you install the latest version of the `@wdio/sauce-service` with

```shell
$ npm install --save-dev @wdio/sauce-service
```

and add `services: ['sauce'],` to the config. If no `region` is provided it will automatically default to the US-Virtual/RDC cloud.
If you provide `region: 'us'` or `region: 'eu'` it will connect to the US or the EU Virtual/RDC cloud.

#### Upload apps to Sauce Storage
If you want to use Android emulators, iOS simulators or Android real devices in the Sauce Labs UI you need to upload the apps to the Sauce
Storage. You can find a script to upload them to, and the US, and EU DC in [this](./scripts)-folder. You can push the files to the storage
by executing the following steps in a terminal from the root of this project:

    cd scripts
    ./push_apps_to_sauce_storage.sh

When you've done that you will see a lot of successful logs in your terminal.

#### Run app tests on the Sauce Labs Real Device Cloud
> **NOTE:** Due to signing iOS Real Devices are not supported. Only Android Real Devices are supported.

Please check the [Android Real Devices](./config/wdio.android.app.conf.ts)-config to see the setup for Android real devices.

You can use the following scripts, see the [`package.json`](./package.json), to execute the tests in the cloud:

    // For Android Real Devices
    // On EU DC
    npm run android.sauce.rdc.app.eu
    // On US DC
    npm run android.sauce.rdc.app.us

#### Run app tests on the Sauce Labs Emulators and Simulators
Please check the following configs to verify the configurations:
- [Android Emulators](./config/saucelabs/wdio.android.emulators.app.conf.ts)
- [iOS Simulators](./config/saucelabs/wdio.ios.simulators.app.conf.ts)

The following scripts that can be used, see the [`package.json`](./package.json), to execute the tests in the cloud:

    // For Android Emulators
    // On EU DC
    npm run android.sauce.emulators.app.eu
    // On US DC
    npm run android.sauce.emulators.app.us
    // For Android Real Devices
    // On EU DC
    npm run android.sauce.rdc.app.eu
    // On US DC
    npm run android.sauce.rdc.app.us

    // For iOS
    // On EU DC
    npm run ios.sauce.simulator.app.eu
    // On US DC
    npm run ios.sauce.simulator.app.us

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
