import { DEFAULT_PIN, INCORRECT_PIN } from './Constants';

class Biometrics {
    private get iosAllowBiometry() {return $('~Don’t Allow');}
    private get allowBiometry() {return $('~OK');}
    private get androidBiometryAlert() {
        const selector = 'android=new UiSelector().textContains("Please log in")';

        return $(selector);
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
        try {
            await this.iosAllowBiometry.waitForDisplayed({ timeout: 3000 });
            await this.allowBiometry.click();
        } catch (e) {
            // This means that allow using touch/facID has already been accepted and thus the alert is not shown
        }
    }

    /**
     * Submit Android biometric login
     */
    async submitAndroidBiometricLogin(fingerprintId:number) {
        await this.androidBiometryAlert.waitForDisplayed();

        await driver.fingerPrint(fingerprintId);
    }
}

export default new Biometrics();
