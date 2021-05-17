import { DEFAULT_PIN } from '../helpers/Constants';

class AndroidSettings {

    /**
     * This is the core methods to enable FingerPrint for Android. It will walk through all steps to enable
     * FingerPrint on Android 7.1 till the latest one all automatically for you.
     */
    enableBiometricLogin() {
        // Android Oreo and higher (Android 8) added `locksettings` to ADB to set the pin. So we need to take
        // a different flow Android on lower than OREO
        // @ts-ignore
        if (parseInt(driver.capabilities.platformVersion) < 8) {
            // Open the settings screen
            this.executeAdbCommand('am start -a android.settings.SECURITY_SETTINGS');
            this.waitAndClick('Fingerprint');
            this.fingerPrintWizardSevenOrLower(DEFAULT_PIN);
        } else {
            // Open the settings screen and set screen lock to pin
            this.executeAdbCommand(`am start -a android.settings.SECURITY_SETTINGS && locksettings set-pin ${DEFAULT_PIN}`);
            this.waitAndClick('Fingerprint');
            this.fingerPrintWizardEightOrHigher(DEFAULT_PIN);
        }
    }

    /**
     * Find an Android element based on text
     */
    findAndroidElementByText(string:string):WebdriverIO.Element {
        const selector = `android=new UiSelector().textContains("${string}")`;

        return $(selector);
    }

    /**
     * Wait and click on an element
     */
    waitAndClick(string: string){
        this.findAndroidElementByText(string).waitForDisplayed();
        this.findAndroidElementByText(string).click();
    }

    /**
     * Execute the fingerprint wizard for Android 7 or lower
     */
    private fingerPrintWizardSevenOrLower(pin:number) {
        this.waitAndClick('NEXT');
        this.setPinSevenOrLower(pin);
        this.touchSensorSevenOrLower(pin);
        this.waitAndClick('DONE');
    }

    /**
     * Enable the finger print through the wizard
     */
    private fingerPrintWizardEightOrHigher(pin: number) {
        // There is a difference in the order the wizard in Android 10 is executed
        // @ts-ignore
        if (parseInt(driver.capabilities.platformVersion) > 9) {
            this.reEnterPin(pin);
            this.waitAndClick('NEXT');
        } else {
            this.waitAndClick('NEXT');
            this.reEnterPin(pin);
        }

        this.touchSensorEightAndHigher(pin);
        this.waitAndClick('DONE');
    }

    /**
     * Re-enter pin and submit screen
     */
    private reEnterPin(pin:number) {
        this.findAndroidElementByText('Re-enter your PIN').waitForDisplayed();
        this.executeAdbCommand(`input text ${pin} && input keyevent 66`);
    }

    /**
     * Set the pin for Android 7 or lower
     */
    private setPinSevenOrLower(pin:number) {
        this.waitAndClick('Fingerprint + PIN');
        this.waitAndClick('No thanks');
        this.findAndroidElementByText('Choose your PIN').waitForDisplayed();
        this.executeAdbCommand(`input text ${pin} && input keyevent 66 && input text ${pin} && input keyevent 66`);
        this.waitAndClick('DONE');
    }

    /**
     * Touch sensor and enable finger print for Android 7 and lower
     */
    private touchSensorSevenOrLower(pin:number) {
        this.waitAndClick('NEXT');
        this.findAndroidElementByText('Put your finger').waitForDisplayed();
        driver.fingerPrint(pin);
        this.findAndroidElementByText('Move your finger').waitForDisplayed();
        driver.fingerPrint(pin);
    }

    /**
     * Touch sensor and enable finger print for Android 8 and higher
     */
    private touchSensorEightAndHigher(pin:number) {
        // Touch the sensor for the first time to trigger finger print
        this.findAndroidElementByText('Touch the sensor').waitForDisplayed();
        driver.fingerPrint(pin);

        // Add finger print
        this.findAndroidElementByText('Put your finger').waitForDisplayed();
        driver.fingerPrint(pin);

        // Confirm finger print
        this.findAndroidElementByText('Keep lifting').waitForDisplayed();
        driver.fingerPrint(pin);
    }

    /**
     * Execute ADB commands on the device
     */
    private executeAdbCommand(adbCommand: string) {
        driver.execute(
            'mobile: shell',
            {
                command: adbCommand,
            },
        );
    }
}

export default new AndroidSettings();
