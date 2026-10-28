# FAQ

## I get the error `No Chromedriver found that can automate Chrome '##.#.####'`
When trying to automate an Android webview in an app or the chrome browser it could be that you get the below error.

```bash
Failed: An unknown server-side error occurred while processing the command. Original error: No Chromedriver found that can automate Chrome '55.0.2883'. See https://github.com/appium/appium/blob/master/docs/en/writing-running-appium/web/chromedriver.md for more details.
```

The solution is to:
- use an older version of ChromeDriver
- manually upgrade chrome on your emulator/device
- pick a newer emulator/device

### Use an older version of ChromeDriver
Go to the link that is provided in the log, see [here](https://github.com/appium/appium/blob/master/docs/en/writing-running-appium/web/chromedriver.md), follow the steps and download the version you need to have.
Then provide the path to the downloaded ChromeDriver by adding the following to your command:

```shell
$ npm run android.app -- --appium.args.chromedriverExecutable="./chromeDriver/chromedriver"
```

The `appium.args.chromedriverExecutable` needs to refer to the location where the ChromeDriver is downloaded.

### Manually update chrome
Execute the following steps to install Chrome on an Android emulator

* Download a Chrome APK from [APKMirror](http://www.apkmirror.com/apk/google-inc/chrome/), check which processor is used in the Emulator (ARM or X86, X86 is faster).
* Open the Emulator
* Install the `chrome.apk` from the folder where it is saved with the following command `adb install chrome.apk`.

`````
[100%] /data/local/tmp/chrome.apk
       	pkg: /data/local/tmp/chrome.apk
Success
`````

* When the message `Success` is shown `Chrome` is installed on the device.

## iOS tests fail
### Issue:
Typing text into an input text element on an iOS simulator with webdriver.io and Appium is causing an error like this

> `An unknown server-side error occurred while processing the command. Original error: An unknown server-side error occurred while processing the command.`

The result is a failing test.

### The command
The command is very simple, just this `$('~accessibilityLabel').setValue('Why are you failing?')`

### The cause
After diving into the logs of webdriver.io, see `webdriver.io.log`, and Appium, see `appium.log`, I saw out that Appium was telling me the following

> `Got response with status 200: {"value":"Error Domain=com.facebook.WebDriverAgent Code=1 \"Keyboard is not present\" UserInfo={NSLocalizedDescription=Keyboard is not present}","sessionId":"15326722-C363-4CA0-B4D8-899E9077F830","status":13}`

#### `webdriver.io log`
```bash
[07:04:25]  COMMAND	POST 	 "/wd/hub/session/c5d34971-6a95-47cb-9c92-e7e807061c14/element"
[07:04:25]  DATA		{"using":"accessibility id","value":"accessibilityLabel"}
[07:04:25]  RESULT		{"ELEMENT":"CC000000-0000-0000-3A0C-000000000000"}
[07:04:25]  COMMAND	POST 	 "/wd/hub/session/c5d34971-6a95-47cb-9c92-e7e807061c14/element/CC000000-0000-0000-3A0C-000000000000/clear"
[07:04:25]  DATA		{}
[07:04:25]  COMMAND	POST 	 "/wd/hub/session/c5d34971-6a95-47cb-9c92-e7e807061c14/element/CC000000-0000-0000-3A0C-000000000000/value"
[07:04:25]  DATA		{"value":["W","h","y"," ","a","r","e"," ","y","o","u"," ","f","a","i","l","i","n","g,"?"],"text":"Why are you failing?"}
```

#### `appium log`
```bash
[HTTP]
[HTTP] --> POST /wd/hub/session/5550bbcd-fad3-40b8-88cd-10350022c6b3/element
[HTTP] {"using":"accessibility id","value":"accessibilityLabel"}
[debug] [MJSONWP] Calling AppiumDriver.findElement() with args: ["accessibility id","accessibilityLabel","5550bbcd-fad3-40b8-88cd-10350022c6b3"]
[debug] [XCUITest] Executing command 'findElement'
[debug] [BaseDriver] Valid locator strategies for this request: xpath, id, name, class name, -ios predicate string, -ios class chain, accessibility id
[debug] [BaseDriver] Waiting up to 0 ms for condition
[debug] [JSONWP Proxy] Proxying [POST /element] to [POST http://localhost:8100/session/15326722-C363-4CA0-B4D8-899E9077F830/element] with body: {"using":"accessibility id","value":"accessibilityLabel"}
[debug] [JSONWP Proxy] Got response with status 200: {"value":{"ELEMENT":"CB000000-0000-0000-9F0B-000000000000"},"sessionId":"15326722-C363-4CA0-B4D8-899E9077F830","status":0}
[debug] [MJSONWP] Responding to client with driver.findElement() result: {"ELEMENT":"CB000000-0000-0000-9F0B-000000000000"}
[HTTP] <-- POST /wd/hub/session/5550bbcd-fad3-40b8-88cd-10350022c6b3/element 200 204 ms - 122
[HTTP]
[HTTP] --> POST /wd/hub/session/5550bbcd-fad3-40b8-88cd-10350022c6b3/element/CB000000-0000-0000-9F0B-000000000000/clear
[HTTP] {}
[debug] [MJSONWP] Calling AppiumDriver.clear() with args: ["CB000000-0000-0000-9F0B-000000000000","5550bbcd-fad3-40b8-88cd-10350022c6b3"]
[debug] [XCUITest] Executing command 'clear'
[debug] [JSONWP Proxy] Proxying [POST /element/CB000000-0000-0000-9F0B-000000000000/clear] to [POST http://localhost:8100/session/15326722-C363-4CA0-B4D8-899E9077F830/element/CB000000-0000-0000-9F0B-000000000000/clear] with no body
[debug] [JSONWP Proxy] Got response with status 200: "{\n  \"status\" : 0,\n  \"id\" : \"CB000000-0000-0000-9F0B-000000000000\",\n  \"value\" : \"\",\n  \"sessionId\" : \"15326722-C363-4CA0-B4D8-899E9077F830\"\n}"
[debug] [MJSONWP] Responding to client with driver.clear() result: null
[HTTP] <-- POST /wd/hub/session/5550bbcd-fad3-40b8-88cd-10350022c6b3/element/CB000000-0000-0000-9F0B-000000000000/clear 200 125 ms - 76
[HTTP]
[HTTP] --> POST /wd/hub/session/5550bbcd-fad3-40b8-88cd-10350022c6b3/element/CB000000-0000-0000-9F0B-000000000000/value
[HTTP] {"value":["W","h","y"," ","a","r","e"," ","y","o","u"," ","f","a","i","l","i","n","g,"?"],"text":"Why are you failing?"}
[debug] [MJSONWP] Calling AppiumDriver.setValue() with args: [["W","h","y"," ","a","r","e"," ","y","o","u"," ","f","a","i","l","i","n","g,"?"],"CB000000-0000-0000-9F0B-000000000000","5550bbcd-fad3-40b8-88cd-10350022c6b3"]
[debug] [XCUITest] Executing command 'setValue'
[debug] [JSONWP Proxy] Proxying [POST /element/CB000000-0000-0000-9F0B-000000000000/value] to [POST http://localhost:8100/session/15326722-C363-4CA0-B4D8-899E9077F830/element/CB000000-0000-0000-9F0B-000000000000/value] with body: {"value":["W","h","y"," ","a","r","e"," ","y","o","u"," ","f","a","i","l","i","n","g,"?"]}
[HTTP] --> GET /wd/hub/status
[HTTP] {}
[debug] [MJSONWP] Calling AppiumDriver.getStatus() with args: []
[debug] [MJSONWP] Responding to client with driver.getStatus() result: {"build":{"version":"1.8.1","revision":"b546436113084d6de584c57b259b947dd467a900"}}
[HTTP] <-- GET /wd/hub/status 200 19 ms - 121
[HTTP]
[debug] [JSONWP Proxy] Got response with status 200: {"value":"Error Domain=com.facebook.WebDriverAgent Code=1 \"Keyboard is not present\" UserInfo={NSLocalizedDescription=Keyboard is not present}","sessionId":"15326722-C363-4CA0-B4D8-899E9077F830","status":13}
[debug] [JSONWP Proxy] Proxying [GET /element/CB000000-0000-0000-9F0B-000000000000/attribute/type] to [GET http://localhost:8100/session/15326722-C363-4CA0-B4D8-899E9077F830/element/CB000000-0000-0000-9F0B-000000000000/attribute/type] with no body
[debug] [JSONWP Proxy] Got response with status 200: "{\n  \"value\" : \"XCUIElementTypeTextField\",\n  \"sessionId\" : \"15326722-C363-4CA0-B4D8-899E9077F830\",\n  \"status\" : 0\n}"
[XCUITest] Cannot type in the text field because of Error: An unknown server-side error occurred while processing the command..
[XCUITest] Trying to apply a workaround...
[debug] [BaseDriver] Set implicit wait to 0ms
[debug] [BaseDriver] Waiting up to 0 ms for condition
[debug] [JSONWP Proxy] Proxying [POST /element] to [POST http://localhost:8100/session/15326722-C363-4CA0-B4D8-899E9077F830/element] with body: {"using":"class name","value":"XCUIElementTypeKeyboard"}
[debug] [JSONWP Proxy] Got response with status 200: {"value":{"ELEMENT":"19010000-0000-0000-9F0B-000000000000"},"sessionId":"15326722-C363-4CA0-B4D8-899E9077F830","status":0}
[debug] [XCUITest] Keyboard found. Continuing with text input.
[debug] [BaseDriver] Set implicit wait to 0ms
[debug] [JSONWP Proxy] Proxying [POST /element/CB000000-0000-0000-9F0B-000000000000/value] to [POST http://localhost:8100/session/15326722-C363-4CA0-B4D8-899E9077F830/element/CB000000-0000-0000-9F0B-000000000000/value] with body: {"value":["W","h","y"," ","a","r","e"," ","y","o","u"," ","f","a","i","l","i","n","g,"?"]}
[debug] [JSONWP Proxy] Got response with status 200: {"value":"Error Domain=com.facebook.WebDriverAgent Code=1 \"Keyboard is not present\" UserInfo={NSLocalizedDescription=Keyboard is not present}","sessionId":"15326722-C363-4CA0-B4D8-899E9077F830","status":13}
[MJSONWP] Encountered internal error running command: Error: An unknown server-side error occurred while processing the command.
[MJSONWP]     at JWProxy.command$ (/Users/wimselles/.nvm/versions/node/v8.9.1/lib/node_modules/appium/node_modules/appium-base-driver/lib/jsonwp-proxy/proxy.js:176:15)
[MJSONWP]     at tryCatch (/Users/wimselles/.nvm/versions/node/v8.9.1/lib/node_modules/appium/node_modules/babel-runtime/regenerator/runtime.js:67:40)
[MJSONWP]     at GeneratorFunctionPrototype.invoke [as _invoke] (/Users/wimselles/.nvm/versions/node/v8.9.1/lib/node_modules/appium/node_modules/babel-runtime/regenerator/runtime.js:315:22)
[MJSONWP]     at GeneratorFunctionPrototype.prototype.(anonymous function) [as next] (/Users/wimselles/.nvm/versions/node/v8.9.1/lib/node_modules/appium/node_modules/babel-runtime/regenerator/runtime.js:100:21)
[MJSONWP]     at GeneratorFunctionPrototype.invoke (/Users/wimselles/.nvm/versions/node/v8.9.1/lib/node_modules/appium/node_modules/babel-runtime/regenerator/runtime.js:136:37)
[MJSONWP]     at <anonymous>
[HTTP] <-- POST /wd/hub/session/5550bbcd-fad3-40b8-88cd-10350022c6b3/element/CB000000-0000-0000-9F0B-000000000000/value 500 9791 ms - 238
```

### Solution
The solution is simple. iOS needs an activated keyboard. Go to `Simulator > Hardware > Keyboard > Toggle software keyboard`, enable the software keyboard and the problem will be gone.

## How to send keyboard input when `setValue` or `driver.keys` does not work
Some custom input controls do not accept `element.setValue(...)` or `driver.keys(...)` directly. In those cases, you can focus the input element first and send the characters as a W3C `performActions` `keyDown` / `keyUp` sequence using `sendKeysViaActions` from [`tests/helpers/Utils.ts`](../tests/helpers/Utils.ts):

```ts
import { sendKeysViaActions } from '../helpers/Utils.js';

await $('~input-field').click();
await sendKeysViaActions('hello@webdriver.io');
```

## How to reset app state or cache between tests
Depending on the platform and device type, there are a few ways to reset app state between tests:

1. **Restart the app without clearing storage (`relaunchApp`):**
   Use `relaunchApp(identifier)` from [`tests/helpers/Utils.ts`](../tests/helpers/Utils.ts) to terminate and re-activate/re-launch the app.
2. **Clear app data on Android (`mobile: clearApp`):**
   ```ts
   await driver.execute('mobile: clearApp', { appId: 'com.wdiodemoapp' });
   await driver.execute('mobile: activateApp', { appId: 'com.wdiodemoapp' });
   ```
3. **Full session reload (`driver.reloadSession()`):**
   Ensure `'appium:app'` is configured in your capabilities (with `'appium:noReset': false`) and call `await driver.reloadSession()` in your hook. Note that on cloud real-device providers, `reloadSession()` releases the current session and triggers device cleanup, which adds significant execution time.

