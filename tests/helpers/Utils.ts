/**
 * Get the time difference in seconds
 */
export function timeDifference (string: string, start:number, end:number) {
    const elapsed = (end - start) / 1000;
    console.log(`${string} It took ${elapsed} seconds.`);
}

/**
 * iOS sims and real devices can be distinguished by their UDID. Based on these sources there is a diff in the UDIDS
 * - https://blog.diawi.com/2018/10/15/2018-apple-devices-and-their-new-udid-format/
 * - https://www.theiphonewiki.com/wiki/UDID
 * iOS sims have more than 1 `-` in the UDID and the UDID is being
 */
export function isIosRealDevice(){
    const realDeviceRegex = /^[a-f0-9]{25}|[a-f0-9]{40}$/i;

    return 'appium:udid' in driver.capabilities && realDeviceRegex.test(driver.capabilities['appium:udid'] as string);
}

/**
 * Create a cross platform solution for opening a deep link
 */
export async function openDeepLinkUrl(url:string) {
    const prefix = 'wdio://';

    if (driver.isAndroid) {
        // Life is so much easier
        return driver.execute('mobile:deepLink', {
            url: `${ prefix }${ url }`,
            package: 'com.wdiodemoapp',
        });
    }

    // We can use `driver.url` on iOS simulators, but not on iOS real devices. The reason is that iOS real devices
    // open Siri when you call `driver.url('')` to use a deep link. This means that real devices need to have a different implementation
    // then iOS sims

    // Check if we are a real device
    if (isIosRealDevice()){
        // Launch Safari to open the deep link
        await driver.execute('mobile: launchApp', { bundleId: 'com.apple.mobilesafari' });

        // Add the deep link url in Safari in the `URL`-field
        // This can be 2 different elements, or the button, or the text field
        // Use the predicate string because  the accessibility label will return 2 different types
        // of elements making it flaky to use. With predicate string we can be more precise
        const addressBarSelector = 'label == "Address" OR name == "URL"';
        const urlFieldSelector = 'type == "XCUIElementTypeTextField" && name CONTAINS "URL"';
        const addressBar = $(`-ios predicate string:${ addressBarSelector }`);
        const urlField = $(`-ios predicate string:${ urlFieldSelector }`);

        // Wait for the url button to appear and click on it so the text field will appear
        // iOS 13 now has the keyboard open by default because the URL field has focus when opening the Safari browser
        if (!(await driver.isKeyboardShown())) {
            await addressBar.waitForDisplayed();
            await addressBar.click();
        }

        // Submit the url and add a break
        await urlField.setValue(`${ prefix }${ url }\uE007`);
    } else {
        // Else we ne are a simulator
        await driver.url(`${ prefix }${ url }`);
    }

    /**
     * PRO TIP:
     * if you started the iOS device with `autoAcceptAlerts:true` in the capabilities then Appium will auto accept the alert that should
     * be shown now. You can then comment out the code below
     */
    // Wait for the notification and accept it
    // When using an iOS simulator you will only get the pop-up once, all the other times it won't be shown
    try {
        const openSelector = 'type == \'XCUIElementTypeButton\' && name CONTAINS \'Open\'';
        const openButton = $(`-ios predicate string:${ openSelector }`);
        // Assumption is made that the alert will be seen within 2 seconds, if not it did not appear
        await openButton.waitForDisplayed({ timeout: 2000 });
        await openButton.click();
    } catch (e) {
        // ignore
    }
}

/**
 * relaunch the app by closing it and starting it again
 */
export async function relaunchApp(identifier:string) {
    const appIdentifier = { [driver.isAndroid ? 'appId' : 'bundleId']: identifier };
    const terminateCommand = 'mobile: terminateApp';
    const launchCommand = `mobile: ${driver.isAndroid ? 'activateApp' : 'launchApp'}`;

    await driver.execute(terminateCommand, appIdentifier);
    await driver.execute(launchCommand, appIdentifier);

}
