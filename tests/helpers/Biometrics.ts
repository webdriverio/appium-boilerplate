import NativeAlert from '../screenobjects/components/NativeAlert.js';
import { DEFAULT_PIN, INCORRECT_PIN } from './Constants.js';

class Biometrics {
    // Due to the iOS driver issue we need to wait for the alert in a different way
    // meaning that we will not use them for now
    // private get iosAllowBiometry() {return $('~Don’t Allow');}
    // private get allowBiometry() {return $('-ios class chain:**/XCUIElementTypeButton[`name == "Allow" OR name=="OK"`]');}
    private get androidBiometryAlert() {
        const regex = '(Please log in|Login with.*)';

        return $(`android=new UiSelector().textMatches("${regex}")`);
    }

    /**
     * Submit biometric login
     */
    async submitBiometricLogin(successful: boolean) {
        // Touch / Face ID needs to be triggered differently on iOS
        if (driver.isIOS) {
            return this.submitIosBiometricLogin(successful);
        }

        return this.submitAndroidBiometricLogin(successful ? DEFAULT_PIN : INCORRECT_PIN);
    }

    /**
     * Submit iOS biometric login
     */
    async submitIosBiometricLogin(successful: boolean) {
        await this.allowIosBiometricUsage();

        return driver.touchId(successful);
    }

    /**
     * Allow biometric usage on iOS if it isn't already accepted
     */
    async allowIosBiometricUsage() {
        // IMPORTANT: The code below is not working as expected
        // // When Touch/FaceID is used for the first time it could be that an alert is shown which needs to be accepted
        // try {
        //     await this.iosAllowBiometry.waitForDisplayed({ timeout: 3 * 1000 });
        //     await this.allowBiometry.click();
        // } catch (e) {
        //     // This means that allow using touch/facID has already been accepted and thus the alert is not shown
        // }
        //
        // This is related to a bug in the appium-xcuitest-driver. The issue is that the alert is only shown in the scope outside
        // of the app, take for example the home screen (com.apple.springboard)
        // See:
        // - https://github.com/appium/appium-xcuitest-driver/issues/2311
        // - https://github.com/appium/appium-xcuitest-driver/issues/2349
        // there are two ways to solve this issue:
        // 1. Use the mobile: alert command to accept the alert
        // try {
        //     await driver.waitUntil(async () => {
        //         const buttons = (await driver.execute('mobile: alert', { action: 'getButtons' })) as string[];
        //         return buttons.includes('Allow');
        //     }, { timeout: 3 * 1000 });
        //     await driver.execute('mobile: alert', { action: 'accept' });
        // } catch (e) {
        //     // This means that allow using touch/facID has already been accepted and thus the alert is not shown
        // }
        // 2. Use the mobile: launchApp command to go back to the app and accept the alert and go back to the app
        // try {
        //     await driver.execute('mobile: launchApp', { bundleId: 'com.apple.springboard' });
        //     await this.iosAllowBiometry.waitForDisplayed({ timeout: 3 * 1000 });
        //     await this.allowBiometry.click();
        //     await driver.execute('mobile: launchApp', { bundleId: BUNDLE_ID });
        // } catch (e) {
        //     // This means that allow using touch/facID has already been accepted and thus the alert is not shown
        // }
        //
        // We will use the first option and will use a helper to interact with the alert
        try {
            await NativeAlert.acceptIOSAlertPermissionDialog({ buttonText: 'Allow|OK', timeout: 3 * 1000 });
        } catch (e) {
            // This means that allow using touch/facID has already been accepted and thus the alert is not shown
        }
    }

    /**
     * Submit Android biometric login
     */
    async submitAndroidBiometricLogin(fingerprintId:number) {
        await this.androidBiometryAlert.waitForDisplayed({ timeout: 10 *1000 });

        await driver.fingerPrint(fingerprintId);
    }
}

export default new Biometrics();
