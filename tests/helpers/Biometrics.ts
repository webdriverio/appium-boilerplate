import { DEFAULT_PIN, INCORRECT_PIN } from './Constants';

class Biometrics {
    get iosAllowBiometry(): WebdriverIO.Element {return $('~Don’t Allow');}
    get allowBiometry(): WebdriverIO.Element {return $('~OK');}
    get androidBiometryAlert(): WebdriverIO.Element {
        const selector = 'android=new UiSelector().textContains("Please log in")';

        return $(selector);
    }

    /**
     * Submit biometric login
     */
    submitBiometricLogin(successful: boolean) {
        // Touch / Face ID needs to be triggered differently on iOS
        if (driver.isIOS) {
            return this.submitIosBiometricLogin(successful);
        }

        return this.submitAndroidBiometricLogin(successful ? DEFAULT_PIN : INCORRECT_PIN);
    }

    /**
     * Submit iOS biometric login
     */
    submitIosBiometricLogin(successful: boolean) {
        this.allowIosBiometricUsage();

        return driver.touchId(successful);
    }

    /**
     * Allow biometric usage on iOS if it isn't already accepted
     */
    allowIosBiometricUsage() {
        // When Touch/FaceID is used for the first time it could be that an alert is shown which needs to be accepted
        try {
            this.iosAllowBiometry.waitForDisplayed({ timeout: 3000 });
            this.allowBiometry.click();
        } catch (e) {
            // This means that allow using touch/facID has already been accepted and thus the alert is not shown
        }
    }

    /**
     * Submit Android biometric login
     */
    submitAndroidBiometricLogin(fingerprintId:number) {
        this.androidBiometryAlert.waitForDisplayed();

        driver.fingerPrint(fingerprintId);
    }
}

export default new Biometrics();
