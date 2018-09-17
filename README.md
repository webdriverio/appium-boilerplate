# appium-boilerplate

Boilerplate project to run Appium tests together with WebdriverIO for:

- iOS/Android Native Apps
- iOS/Android Hybrid Apps
- Android Chrome and iOS Safari browser

## Quick start
Choose one of the following options:

1. Clone the git repo — `git clone https://github.com/webdriverio/appium-boilerplate.git`

2. Then copy the files to your project directory (all files in `/test` and the `wdio.conf`-files in the `config`-folder)

3. Merge project dev dependencies with your projects dev dependencies in your `package.json`

## FAQ
See [FAQ](./docs/FAQ.md)

## Tips and Tricks

### Useful information
Check the following sites for more information about WebdriverIO/Appium
- [WebdriverIO](http://webdriver.io)
- [Appium Docs](http://appium.io/docs/en/about-appium/intro/)
- [Appium Pro Newsletter](http://appiumpro.com)

### Is it wise to use XPATH?
The advise is to prevent using XPATH unless there is no other option. XPATH is a brittle locator strategy and will take some time to find elements on a page.
More info about that can be found in the [Appium Pro News letters](https://appiumpro.com):
- [Making Your Appium Tests Fast and Reliable, Part 2: Finding Elements](https://appiumpro.com/editions/20)
- [How to Find Elements in iOS (Not) By XPath](https://appiumpro.com/editions/8)

#### Example
Checking if the WebView is loaded including the webpage can be done in **4 seconds** with this piece of JS

```js
import TabBar from '../screenobjects/components/tab.bar';
import WebViewScreen from '../screenobjects/webview.screen';

describe('tab bar', () => {
    it('open the webview', () => {
        TabBar.openWebView();
        WebViewScreen.waitForWebsiteLoaded();
    });
});
```

Resulting in this logging

```bash
[17:27:10]  COMMAND     POST     "/wd/hub/session/49597125-beee-471a-b04b-bc2879c56a91/element/18000000-0000-0000-EF70-000000000000/click"
[17:27:10]  DATA                {}
[17:27:11]  COMMAND     GET      "/wd/hub/session/49597125-beee-471a-b04b-bc2879c56a91/contexts"
[17:27:11]  DATA                {}
[17:27:11]  RESULT              ["NATIVE_APP"]
[17:27:11]  COMMAND     GET      "/wd/hub/session/49597125-beee-471a-b04b-bc2879c56a91/contexts"
[17:27:11]  DATA                {}
[17:27:11]  RESULT              ["NATIVE_APP"]
[17:27:11]  COMMAND     GET      "/wd/hub/session/49597125-beee-471a-b04b-bc2879c56a91/contexts"
[17:27:11]  DATA                {}
[17:27:11]  RESULT              ["NATIVE_APP"]
[17:27:11]  COMMAND     GET      "/wd/hub/session/49597125-beee-471a-b04b-bc2879c56a91/contexts"
[17:27:11]  DATA                {}
[17:27:11]  RESULT              ["NATIVE_APP"]
[17:27:11]  COMMAND     GET      "/wd/hub/session/49597125-beee-471a-b04b-bc2879c56a91/contexts"
[17:27:11]  DATA                {}
[17:27:11]  RESULT              ["NATIVE_APP"]
[17:27:11]  COMMAND     GET      "/wd/hub/session/49597125-beee-471a-b04b-bc2879c56a91/contexts"
[17:27:11]  DATA                {}
[17:27:11]  RESULT              ["NATIVE_APP"]
[17:27:12]  COMMAND     GET      "/wd/hub/session/49597125-beee-471a-b04b-bc2879c56a91/contexts"
[17:27:12]  DATA                {}
[17:27:12]  RESULT              ["NATIVE_APP"]
[17:27:12]  COMMAND     GET      "/wd/hub/session/49597125-beee-471a-b04b-bc2879c56a91/contexts"
[17:27:12]  DATA                {}
[17:27:12]  RESULT              ["NATIVE_APP"]
[17:27:12]  COMMAND     GET      "/wd/hub/session/49597125-beee-471a-b04b-bc2879c56a91/contexts"
[17:27:12]  DATA                {}
[17:27:12]  RESULT              ["NATIVE_APP","WEBVIEW_28911.2"]
[17:27:12]  COMMAND     GET      "/wd/hub/session/49597125-beee-471a-b04b-bc2879c56a91/contexts"
[17:27:12]  DATA                {}
[17:27:12]  RESULT              ["NATIVE_APP","WEBVIEW_28911.2"]
[17:27:12]  COMMAND     POST     "/wd/hub/session/49597125-beee-471a-b04b-bc2879c56a91/context"
[17:27:12]  DATA                {"name":"WEBVIEW_28911.2"}
[17:27:14]  COMMAND     POST     "/wd/hub/session/49597125-beee-471a-b04b-bc2879c56a91/execute"
[17:27:14]  DATA                {"script":"return (function () {\n                    return document.readyState;\n                }).apply(null, arguments)","args":[]}
[17:27:14]  RESULT              "complete"
```

When this is done with XPATH it will take **27 seconds** and we only checked if the WebView, not even the webpage itself, is visible.

```js
import TabBar from '../screenobjects/components/tab.bar';
import WebViewScreen from '../screenobjects/webview.screen';

describe('tab bar', () => {
    it('open the webview', () => {
        TabBar.openWebView();
        WebViewScreen.waitForScreenIsShownByXpath(true);
    });
});
```

Resulting in this logging

```bash
[17:40:50]  COMMAND     POST     "/wd/hub/session/91d8e0c5-b332-4c25-ab2f-26cd4999030c/element/18000000-0000-0000-B571-000000000000/click"
[17:40:50]  DATA                {}
[17:40:51]  COMMAND     POST     "/wd/hub/session/91d8e0c5-b332-4c25-ab2f-26cd4999030c/elements"
[17:40:51]  DATA                {"using":"xpath","value":"//XCUIElementTypeOther[@name=\"WEBDRIVER I/O Demo app for the appium-boilerplate   Support\"]/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeWebView"}
[17:40:52]  RESULT              []
[17:40:52]  COMMAND     POST     "/wd/hub/session/91d8e0c5-b332-4c25-ab2f-26cd4999030c/elements"
[17:40:52]  DATA                {"using":"xpath","value":"//XCUIElementTypeOther[@name=\"WEBDRIVER I/O Demo app for the appium-boilerplate   Support\"]/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeWebView"}
[17:40:52]  RESULT              []
[17:40:52]  COMMAND     POST     "/wd/hub/session/91d8e0c5-b332-4c25-ab2f-26cd4999030c/elements"
[17:40:52]  DATA                {"using":"xpath","value":"//XCUIElementTypeOther[@name=\"WEBDRIVER I/O Demo app for the appium-boilerplate   Support\"]/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeWebView"}
[17:40:53]  RESULT              []
[17:40:53]  COMMAND     POST     "/wd/hub/session/91d8e0c5-b332-4c25-ab2f-26cd4999030c/elements"
[17:40:53]  DATA                {"using":"xpath","value":"//XCUIElementTypeOther[@name=\"WEBDRIVER I/O Demo app for the appium-boilerplate   Support\"]/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeWebView"}
[17:40:53]  RESULT              []
[17:40:53]  COMMAND     POST     "/wd/hub/session/91d8e0c5-b332-4c25-ab2f-26cd4999030c/elements"
[17:40:53]  DATA                {"using":"xpath","value":"//XCUIElementTypeOther[@name=\"WEBDRIVER I/O Demo app for the appium-boilerplate   Support\"]/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeWebView"}
[17:40:54]  RESULT              []
[17:40:54]  COMMAND     POST     "/wd/hub/session/91d8e0c5-b332-4c25-ab2f-26cd4999030c/elements"
[17:40:54]  DATA                {"using":"xpath","value":"//XCUIElementTypeOther[@name=\"WEBDRIVER I/O Demo app for the appium-boilerplate   Support\"]/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeWebView"}
[17:40:54]  RESULT              []
[17:40:54]  COMMAND     POST     "/wd/hub/session/91d8e0c5-b332-4c25-ab2f-26cd4999030c/elements"
[17:40:54]  DATA                {"using":"xpath","value":"//XCUIElementTypeOther[@name=\"WEBDRIVER I/O Demo app for the appium-boilerplate   Support\"]/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeWebView"}
[17:41:01]  RESULT              [{"ELEMENT":"37000000-0000-0000-B571-000000000000"}]
[17:41:01]  COMMAND     GET      "/wd/hub/session/91d8e0c5-b332-4c25-ab2f-26cd4999030c/element/37000000-0000-0000-B571-000000000000/displayed"
[17:41:01]  DATA                {}
[17:41:07]  RESULT              true
```


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
