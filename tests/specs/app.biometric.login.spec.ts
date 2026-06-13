import TabBar from '../screenobjects/components/TabBar.js';
import LoginScreen from '../screenobjects/LoginScreen.js';
import Biometrics from '../helpers/Biometrics.js';
import NativeAlert from '../screenobjects/components/NativeAlert.js';
import AndroidSettings from '../screenobjects/AndroidSettings.js';
import { executeInHomeScreenContext, isAndroidRealDevice, relaunchApp } from '../helpers/Utils.js';
import { BUNDLE_ID, PACKAGE_NAME, TIMEOUTS } from '../helpers/Constants.js';

/**
 * IMPORTANT!
 * To verify if Touch/FaceID for iOS and FingerPrint for Android work we need to verify if they are enabled. This can be done by verifying
 * if the biometrics button is shown. If not shown we need to enabled it.
 * For iOS it's pretty straightforward, but for Android is more complex. There is a helper (Android Settings) that will handle all steps for
 * you for Android 9.0 (2018) till the latest version of Android.
 */
describe('WebdriverIO and Appium, when interacting with a biometric button,', () => {
    // Use a regular function (not arrow) so `this.skip()` binds correctly in Mocha.
    beforeEach(async function () {
        // wdio-native-demo-app v2.2.0 does not render the biometric button on iOS 26.x.
        // The app's LocalAuthentication availability check returns false regardless of
        // simulator enrollment state — this is an app-level incompatibility with iOS 26.x.
        // TODO: remove this guard once the demo app is updated to support iOS 26.x.
        // Appium strips the 'appium:' prefix from capabilities in the session response,
        // so the key is 'platformVersion' at runtime, not 'appium:platformVersion'.
        // Check both forms to be safe.
        const caps = driver.capabilities as Record<string, unknown>;
        const platformVersion = (
            caps['platformVersion'] ??
            caps['appium:platformVersion'] ??
            '0'
        ) as string;
        if (driver.isIOS && parseInt(platformVersion, 10) >= 26) {
            return this.skip();
        }

        // driver.fingerPrint() is emulator-only on Android — it throws on real devices.
        // Skip the entire suite when running against a real Android device.
        if (isAndroidRealDevice()) {
            return this.skip();
        }

        await goToLoginPage();

        // If the biometry is not shown on iOS, enable it on the phone
        if (driver.isIOS && !(await LoginScreen.isBiometricButtonDisplayed())) {
            // iOS us pretty straightforward, just enabled it
            await driver.toggleEnrollTouchId(true);
            // restart the app
            await relaunchApp(BUNDLE_ID);

            // Wait for the app again and go to the login screen
            await goToLoginPage();
        } else if (driver.isAndroid && !(await LoginScreen.isBiometricButtonDisplayed())) {
            // Android is more complex, see this method
            await AndroidSettings.enableBiometricLogin();
            // restart the app
            await relaunchApp(PACKAGE_NAME);

            // Wait for the app again and go to the login screen
            await goToLoginPage();
        }
    });

    it('should be able to login with a matching touch/faceID/fingerprint', async () => {
        // Always make sure you are on the right tab
        await LoginScreen.tapOnLoginContainerButton();
        // Press the touch/faceID/Fingerprint button
        await LoginScreen.tapOnBiometricButton();
        // This method will successfully handle the biometric login for OR Android, OR iOS.
        await Biometrics.submitBiometricLogin(true);
        // Wait for the alert and validate it
        await NativeAlert.waitForIsShown();
        await expect(await NativeAlert.text()).toContain('Success');

        if (driver.isIOS){
            // The native Face ID overlay briefly obscures the alert after a successful match.
            // Poll until the alert is reachable rather than sleeping a fixed amount of time.
            await driver.waitUntil(
                async () => {
                    try {
                        await NativeAlert.waitForIsShown(true);
                        return true;
                    } catch {
                        return false;
                    }
                },
                { timeout: TIMEOUTS.QUICK, interval: 250, timeoutMsg: 'Alert not tappable after Face ID overlay disappeared' },
            );
        }

        // Close the alert
        await NativeAlert.tapOnButtonWithText('OK');
        await NativeAlert.waitForIsShown(false);
    });

    it('should NOT be able to login with a non matching touch/faceID/fingerprint', async () => {
        // Always make sure you are on the right tab
        await LoginScreen.tapOnLoginContainerButton();
        // Press the touch/faceID/Fingerprint button
        await LoginScreen.tapOnBiometricButton();
        // This method will let the biometric login for OR Android, OR iOS fail.
        await Biometrics.submitBiometricLogin(false);

        // Android doesn't show an alert, but keeps the "use fingerprint" native modal in the screen
        if (driver.isIOS) {
            // NOTE:
            // With `appium-xcuitest-driver` V6 and higher this alert can't by default be detected by Appium. To work around this
            // we switch to the home screen context and accept the alert there.
            // This is a workaround for the issue described here:
            await executeInHomeScreenContext(async () => {
                // Wait for the alert and validate it
                await NativeAlert.waitForIsShown();
                // There's the English and US version of the "Not Recognized|Not Recognised"" text, so we just check for "Not Recogni
                await expect(await NativeAlert.text()).toContain('Not Recogni');

                // Close the alert
                await NativeAlert.tapOnButtonWithText('Cancel');
                await NativeAlert.waitForIsShown(false);
            });
        } else {
            await AndroidSettings.waitAndTap('Cancel');
            // @TODO: This takes very long, need to fix this
            await AndroidSettings.findAndroidElementByMatchingText('Cancel').waitForDisplayed({ reverse: true, timeout: TIMEOUTS.LONG, timeoutMsg: 'Cancel button still visible after biometric failure' });
            await NativeAlert.waitForIsShown(false);
        }
    });
});

/**
 * Go to the login screen
 */
async function goToLoginPage(){
    await TabBar.waitForTabBarShown();
    await TabBar.openLogin();
    await LoginScreen.waitForIsShown(true);
}
