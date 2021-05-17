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
    beforeEach(() => {
        goToLoginPage();

        // If the biometry is not shown on iOS, enable it on the phone
        if (driver.isIOS && !LoginScreen.biometricButton.isDisplayed()) {
            // iOS us pretty straightforward, just enabled it
            driver.toggleEnrollTouchId(true);
            // restart the app
            driver.reset();

            // Wait for the app again and go to the login screen
            goToLoginPage();
        } else if (driver.isAndroid && !LoginScreen.biometricButton.isDisplayed()) {
            // Android is more complex, see this method
            AndroidSettings.enableBiometricLogin();
            // restart the app
            driver.reset();

            // Wait for the app again and go to the login screen
            goToLoginPage();
        }
    });

    it('should be able to login with a matching touch/faceID/fingerprint', () => {
        // Always make sure you are on the right tab
        LoginScreen.loginContainerButton.click();
        // Press the touch/faceID/Fingerprint button
        LoginScreen.biometricButton.click();
        // This method will successfully handle the biometric login for OR Android, OR iOS.
        Biometrics.submitBiometricLogin(true);
        // Wait for the alert and validate it
        NativeAlert.waitForIsShown();
        expect(NativeAlert.text()).toEqual('Success\nYou are logged in!');

        // Close the alert
        NativeAlert.pressButton('OK');
        NativeAlert.waitForIsShown(false);
    });

    it('should NOT be able to login with a non matching touch/faceID/fingerprint', () => {
        // Always make sure you are on the right tab
        LoginScreen.loginContainerButton.click();
        // Press the touch/faceID/Fingerprint button
        LoginScreen.biometricButton.click();
        // This method will let the biometric login for OR Android, OR iOS fail.
        Biometrics.submitBiometricLogin(false);

        // iOS shows an alert, Android doesn't
        if (driver.isIOS) {
            // Wait for the alert and validate it
            NativeAlert.waitForIsShown();
            expect(NativeAlert.text()).toContain('Try Again');

            // Close the alert
            NativeAlert.pressButton('Cancel');
            try {
                // In certain situations we need to Cancel it again for this specific app
                NativeAlert.pressButton('Cancel');
            } catch (ign) {
                // Do nothing
            }
            NativeAlert.waitForIsShown(false);
        } else {
            AndroidSettings.waitAndClick('Cancel');

            // When FingerPrint in this app is cancelled on Android 9 and higher it will show the
            // FingerPrint modal again. This means it needs to be cancelled again.
            // @ts-ignore
            if (parseInt(driver.capabilities.platformVersion) > 8){
                // This will show the face ID alert again. Let it fail again to make the alert go away.
                Biometrics.submitBiometricLogin(false);
                AndroidSettings.waitAndClick('Cancel');
            }
            AndroidSettings.findAndroidElementByText('Cancel').waitForDisplayed({ reverse:true });
            NativeAlert.waitForIsShown(false);
        }
    });
});

/**
 * Go to the login screen
 */
function goToLoginPage(){
    TabBar.waitForTabBarShown();
    TabBar.openLogin();
    LoginScreen.waitForIsShown(true);
}
