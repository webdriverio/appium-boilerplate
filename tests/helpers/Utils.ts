import { BUNDLE_ID, PACKAGE_NAME } from './Constants.js';

// iOS Safari selectors used by openDeepLinkUrl on real devices.
// Predicate String is preferred over accessibility ID — the label "Address" vs "URL"
// differs between iOS versions, making a single predicate condition more stable.
const SELECTORS = {
    IOS_SAFARI_ADDRESS_BAR: '-ios predicate string:label == "Address" OR name == "URL"',
    IOS_SAFARI_URL_FIELD: '-ios predicate string:type == "XCUIElementTypeTextField" && name CONTAINS "URL"',
} as const;

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
    const realDeviceRegex = /^([a-f0-9]{25}|[a-f0-9]{40})$/i;

    return 'appium:udid' in driver.capabilities && realDeviceRegex.test(driver.capabilities['appium:udid'] as string);
}

/**
 * Android emulators report a serial that starts with "emulator-".
 * Real Android devices use a numeric or alphanumeric USB serial — never that prefix.
 */
export function isAndroidRealDevice(): boolean {
    const serial = (
        (driver.capabilities as Record<string, unknown>)['appium:udid'] ??
        (driver.capabilities as Record<string, unknown>)['udid'] ??
        ''
    ) as string;

    return driver.isAndroid && !serial.toLowerCase().startsWith('emulator-');
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
            package: PACKAGE_NAME,
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
        const addressBar = $(SELECTORS.IOS_SAFARI_ADDRESS_BAR);
        const urlField = $(SELECTORS.IOS_SAFARI_URL_FIELD);

        // Wait for the url button to appear and click on it so the text field will appear
        // iOS 13 now has the keyboard open by default because the URL field has focus when opening the Safari browser
        if (!(await driver.isKeyboardShown())) {
            await addressBar.waitForDisplayed({ timeoutMsg: 'Safari address bar not shown within timeout' });
            await addressBar.click();
        }

        // Wait for the text field to be ready before typing \u2014 it may not be
        // immediately interactive after the address bar click triggers focus.
        await urlField.waitForDisplayed({ timeoutMsg: 'Safari URL text field not displayed within timeout' });

        // Submit the url and add a break
        await urlField.setValue(`${ prefix }${ url }\uE007`);
    } else {
        // Use mobile: deepLink for iOS simulators — activates the app by bundle ID first,
        // then navigates to the URL within it. This avoids the SpringBoard "Open in app?"
        // dialog that driver.url() triggers on iOS 26.x.
        await driver.execute('mobile: deepLink', {
            url: `${ prefix }${ url }`,
            bundleId: BUNDLE_ID,
        });
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

type AppInfo = {
    processArguments: {
        env: { [key: string]: any };
        args: any[];
    };
    name: string;
    pid: number;
    bundleId: string;
};

/**
 * Typically, app dialogs are initiated by the application itself and can be interacted with via standard Appium commands. However, there are occasions
 * when a dialog is initiated by the operating system, rather than the app. An example of this is the "Touch/Face ID" permission dialog on iOS. This is happening
 * with `appium-xcuitest-driver` V6 and higher.
 * Since this dialog is outside the app's context, normal Appium interactions within the app context won't work. To interact with such dialogs, a strategy is to switch
 * the interaction context to the home screen. The `executeInHomeScreenContext` function is designed for this purpose. For iOS, it temporarily changes the
 * interaction context to the home screen (com.apple.springboard), allowing interaction with the system dialog, and then switches back to the original app context
 * post-interaction.
 * Src: https://appium.github.io/appium-xcuitest-driver/latest/guides/troubleshooting/#interact-with-dialogs-managed-by-comapplespringboard
 */
export async function executeInHomeScreenContext(action:() => Promise<void>): Promise<any> {
    // For Android, directly execute the action as this workaround isn't necessary
    if (driver.isAndroid) {
        return action();
    }

    // Retrieve the currently active app information
    const activeAppInfo: AppInfo = await driver.execute('mobile: activeAppInfo');
    // Switch the active context to the iOS home screen
    await driver.updateSettings({ 'defaultActiveApplication': 'com.apple.springboard' });
    let result;

    try {
        // Execute the action in the home screen context
        result = await action();
    } catch {
        // Expected: SpringBoard dialog not present — the biometric permission alert
        // was already accepted in a prior session.  No action required.
    }

    // Revert to the original app context
    await driver.updateSettings({ 'defaultActiveApplication': activeAppInfo.bundleId });

    return result;
}
