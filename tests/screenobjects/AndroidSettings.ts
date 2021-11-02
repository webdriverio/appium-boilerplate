import { DEFAULT_PIN } from '../helpers/Constants';

class AndroidSettings {
    /**
     * Get the platform version
     */
    private get platformVersion(): number {
        return parseInt(
            (('platformVersion' in driver.capabilities &&
                driver.capabilities.platformVersion) as string) || '8',
            10,
        );
    }

    /**
     * Execute the fingerprint wizard for Android 7 or lower
     */
    private async fingerPrintWizardSevenOrLower(pin: number) {
        await this.waitAndTap('NEXT');
        await this.setPinSevenOrLower(pin);
        await this.touchSensorSevenOrLower(pin);
        await this.waitAndTap('DONE');
    }

    /**
     * Enable the finger print through the wizard
     */
    private async fingerPrintWizardEightOrHigher(pin: number) {
        // There is a difference in the order the wizard in Android 10 is executed
        if (this.platformVersion > 9) {
            await this.reEnterPin(pin);
            await this.waitAndTap('NEXT');
        } else {
            await this.waitAndTap('NEXT');
            await this.reEnterPin(pin);
        }

        await this.touchSensorEightAndHigher(pin);
        await this.waitAndTap('DONE');
    }

    /**
     * Re-enter pin and submit screen
     */
    private async reEnterPin(pin: number) {
        await (await this.findAndroidElementByText('Re-enter your PIN')).waitForDisplayed();
        await this.executeAdbCommand(`input text ${pin} && input keyevent 66`);
    }

    /**
     * Set the pin for Android 7 or lower
     */
    private async setPinSevenOrLower(pin: number) {
        await this.waitAndTap('Fingerprint + PIN');
        await this.waitAndTap('No thanks');
        await (await this.findAndroidElementByText('Choose your PIN')).waitForDisplayed();
        await this.executeAdbCommand(
            `input text ${pin} && input keyevent 66 && input text ${pin} && input keyevent 66`,
        );
        await this.waitAndTap('DONE');
    }

    /**
     * Touch sensor and enable finger print for Android 7 and lower
     */
    private async touchSensorSevenOrLower(touchCode: number) {
        await this.waitAndTap('NEXT');
        await (await this.findAndroidElementByText('Put your finger')).waitForDisplayed();
        await driver.fingerPrint(touchCode);
        await (await this.findAndroidElementByText('Move your finger')).waitForDisplayed();
        await driver.fingerPrint(touchCode);
    }

    /**
     * Touch sensor and enable finger print for Android 8 and higher
     */
    private async touchSensorEightAndHigher(touchCode: number) {
        // Touch the sensor for the first time to trigger finger print
        await (await this.findAndroidElementByText('Touch the sensor')).waitForDisplayed();
        await driver.fingerPrint(touchCode);

        // Add finger print
        await (await this.findAndroidElementByText('Put your finger')).waitForDisplayed();
        await driver.fingerPrint(touchCode);

        // Confirm finger print
        await (await this.findAndroidElementByText('Keep lifting')).waitForDisplayed();
        await driver.fingerPrint(touchCode);
    }

    /**
     * Execute ADB commands on the device
     */
    private async executeAdbCommand(adbCommand: string) {
        await driver.execute('mobile: shell', {
            command: adbCommand,
        });
    }

    /**
     * Find an Android element based on text
     */
    async findAndroidElementByText(string: string) {
        const selector = `android=new UiSelector().textContains("${string}")`;

        return $(selector);
    }

    /**
     * Wait and click on an element
     */
    async waitAndTap(string: string) {
        await (await this.findAndroidElementByText(string)).waitForDisplayed();
        await (await this.findAndroidElementByText(string)).click();
    }

    /**
     * This is the core methods to enable FingerPrint for Android. It will walk through all steps to enable
     * FingerPrint on Android 7.1 till the latest one all automatically for you.
     */
    async enableBiometricLogin() {
        // Android Oreo and higher (Android 8) added `lock settings` to ADB to set the pin. So we need to take
        // a different flow Android on lower than OREO
        if (this.platformVersion < 8) {
            // Open the settings screen
            await this.executeAdbCommand(
                'am start -a android.settings.SECURITY_SETTINGS',
            );
            await this.waitAndTap('Fingerprint');
            await this.fingerPrintWizardSevenOrLower(DEFAULT_PIN);
        } else {
            // Open the settings screen and set screen lock to pin
            await this.executeAdbCommand(
                `am start -a android.settings.SECURITY_SETTINGS && locksettings set-pin ${DEFAULT_PIN}`,
            );
            await this.waitAndTap('Fingerprint');
            await this.fingerPrintWizardEightOrHigher(DEFAULT_PIN);
        }
    }
}

export default new AndroidSettings();
