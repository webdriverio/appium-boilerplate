import TabBar from '../screenobjects/components/TabBar';
import LoginScreen from '../screenobjects/LoginScreen';
import Biometrics from '../helpers/Biometrics';
import NativeAlert from '../screenobjects/components/NativeAlert';
import AndroidSettings from '../screenobjects/AndroidSettings';

/**
 * IMPORTANT!
 * To verify if Touch/FaceID for iOS and FingerPrint for Android work we need to verify if they are enabled. This can be done by verifying
 * if the biometrics button is shown. If not shown we need to enabled it.
 * For iOS it's pretty straightforward, but for Android is more complex. There is a helper (Android Settings) that will handle all steps for
 * you for Android 7.1 till the latest version of Android.
 */
describe('WebdriverIO and Appium, when interacting with a biometric button,', () => {
    beforeEach(async () => {
        await goToLoginPage();

        // If the biometry is not shown on iOS, enable it on the phone
        if (driver.isIOS && !(await LoginScreen.isBiometricButtonDisplayed())) {
            // iOS us pretty straightforward, just enabled it
            await driver.toggleEnrollTouchId(true);
            // restart the app
            await driver.reset();

            // Wait for the app again and go to the login screen
            await goToLoginPage();
        } else if (driver.isAndroid && !(await LoginScreen.isBiometricButtonDisplayed())) {
            // Android is more complex, see this method
            await AndroidSettings.enableBiometricLogin();
            // restart the app
            await driver.reset();

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
        await expect(await NativeAlert.text()).toContain('Success\nYou are logged in!');

        // Close the alert
        await NativeAlert.topOnButtonWithText('OK');
        await NativeAlert.waitForIsShown(false);
    });

    it('should NOT be able to login with a non matching touch/faceID/fingerprint', async () => {
        // Always make sure you are on the right tab
        await LoginScreen.tapOnLoginContainerButton();
        // Press the touch/faceID/Fingerprint button
        await LoginScreen.tapOnBiometricButton();
        // This method will let the biometric login for OR Android, OR iOS fail.
        await Biometrics.submitBiometricLogin(false);

        // iOS shows an alert, Android doesn't
        if (driver.isIOS) {
            // Wait for the alert and validate it
            await NativeAlert.waitForIsShown();
            await expect(await NativeAlert.text()).toContain('Try Again');

            // Close the alert
            await NativeAlert.topOnButtonWithText('Cancel');
            try {
                // In certain situations we need to Cancel it again for this specific app
                await NativeAlert.topOnButtonWithText('Cancel');
            } catch (ign) {
                // Do nothing
            }
            await NativeAlert.waitForIsShown(false);
        } else {
            await AndroidSettings.waitAndTap('Cancel');

            // When FingerPrint in this app is cancelled on Android 9 and higher it will show the
            // FingerPrint modal again. This means it needs to be cancelled again.
            // @ts-ignore
            if (parseInt(driver.capabilities.platformVersion) > 8){
                // This will show the face ID alert again. Let it fail again to make the alert go away.
                await Biometrics.submitBiometricLogin(false);
                await AndroidSettings.waitAndTap('Cancel');
            }
            await (await AndroidSettings.findAndroidElementByText('Cancel')).waitForDisplayed({ reverse:true });
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
