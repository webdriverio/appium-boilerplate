import { DEFAULT_PIN, INCORRECT_PIN, TIMEOUTS } from './Constants.js';
import { executeInHomeScreenContext } from './Utils.js';

const SELECTORS = {
    // U+2019 RIGHT SINGLE QUOTATION MARK in the string value matches the iOS system button label.
    IOS_DONT_ALLOW: '~Don’t Allow',
    // Class Chain covers both "Allow" (Touch ID) and "OK" (Face ID) permission buttons.
    IOS_ALLOW_BIOMETRY: '-ios class chain:**/XCUIElementTypeButton[`name == "Allow" OR name=="OK"`]',
    // Regex matches both the initial login prompt and subsequent re-auth prompts.
    ANDROID_BIOMETRY_ALERT: (regex: string) => `android=new UiSelector().textMatches("${regex}")`,
} as const;

const ANDROID_BIOMETRY_REGEX = '(Please log in|Login with.*)';

class Biometrics {
    private get iosAllowBiometry() {return $(SELECTORS.IOS_DONT_ALLOW);}
    private get allowBiometry() {return $(SELECTORS.IOS_ALLOW_BIOMETRY);}
    private get androidBiometryAlert() {
        return $(SELECTORS.ANDROID_BIOMETRY_ALERT(ANDROID_BIOMETRY_REGEX));
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
        // When Touch/FaceID is used for the first time it could be that an alert is shown which needs to be accepted
        //
        // NOTE:
        // With `appium-xcuitest-driver` V6 and higher this alert can't by default be detected by Appium. To work around this
        // we switch to the home screen context and accept the alert there.
        // This is a workaround for the issue described here:
        // - https://github.com/appium/appium/issues/19716
        await executeInHomeScreenContext(async () => {
            try {
                await this.iosAllowBiometry.waitForDisplayed({ timeout: TIMEOUTS.VERY_SHORT, timeoutMsg: 'iOS biometry permission alert not shown within timeout' });
                await this.allowBiometry.click();
            } catch {
                // Biometry permission already accepted — alert not shown, safe to continue
            }
        });
    }

    /**
     * Submit Android biometric login
     */
    async submitAndroidBiometricLogin(fingerprintId:number) {
        await this.androidBiometryAlert.waitForDisplayed({ timeout: TIMEOUTS.SHORT, timeoutMsg: 'Android biometry alert not shown within timeout' });

        await driver.fingerPrint(fingerprintId);
    }
}

export default new Biometrics();
