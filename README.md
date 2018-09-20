# appium-boilerplate

Boilerplate project to run Appium tests together with WebdriverIO for:

- iOS/Android Native Apps
- iOS/Android Hybrid Apps
- Android Chrome and iOS Safari browser (see [TODO](./README.md##todo))

> This boilerplate uses the WebdriverIO native demo app which can be found [here](https://github.com/webdriverio/native-demo-app).
> The releases can be found and downloaded [here](https://github.com/webdriverio/native-demo-app/releases).

> Note:
> This boilerplate only handles local execution on 1 em/simulator at a time, not parallel execution. For more info about that Google on setting up a grid with Appium.


![webdriverio-demo-app-ios.ios](./docs/assets/appium-tests.gif)

## Quick start
Choose one of the following options:

1. Clone the git repo — `git clone https://github.com/webdriverio/appium-boilerplate.git`

2. Then copy the files to your project directory (all files in `/test` and the `wdio.conf`-files in the `config`-folder)

3. Merge project dev dependencies with your projects dev dependencies in your `package.json`

4. merge the scripts to your `package.json` scripts

5. Run the tests for iOS with `npm run ios.app` and for Android with `npm run android.app`

## Based on
This boilerplate is currently based on:
- **WebdriverIO:** `4.13.#`
- **Appium:** `1.9.0`

Updates to the latest versions will come, see [TODO](./README.md##todo)

## Installing Appium on a local machine
See [Installing Appium on a local machine](./docs/APPIUM.md)

## Config
This boilerplate uses a specific config for iOS and Android, see [configs](./config/) and are based on `wdio.shared.conf.js`.
This shared config holds all the defaults so the iOS and Android configs only need to hold the capabilities that are needed for running on iOS and or Android.

## FAQ
See [FAQ](./docs/FAQ.md)

## Tips and Tricks
See [Tips and Tricks](./docs/TIPS_TRICKS.md)


# TODO
- Setup configs for:
  - [x] iOS and Android app
  - [ ] iOS and Android browsers
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
  - [ ] Browsers
- [ ] Write docs
- Update dependencies:
  - [ ] Update to work with WebdriverIO `5.#.#`
