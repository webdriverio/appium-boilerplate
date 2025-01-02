import { DEFAULT_PIN } from '../helpers/Constants.js';

class AndroidSettings {
    /**
     * Get the platform version
     */
    private get platformVersion(): number {
        return parseInt(
            ('platformVersion' in driver.capabilities ? driver.capabilities['platformVersion'] : '9') as string,
            10,
        );
    }

    /**
     * Enable the finger print through the wizard
     */
    private async fingerPrintWizard(pin: number) {
        // There is a difference in the order the wizard in Android 10+ is executed
        if (this.platformVersion >= 10) {
            await this.postAndroidTenFingerPrintSetup(pin);
        } else {
            await this.preAndroidTenFingerPrintSetup(pin);
        }

        await this.touchFingerPrintSensor(pin);
        await this.waitAndTap('DONE');
    }

    /**
     * Pre Android 10 finger print setup steps
     */
    private async preAndroidTenFingerPrintSetup(pin: number){
        await this.waitAndTap('NEXT');
        await this.reEnterPin(pin);
    }

    /**
     * Post Android 10 finger print setup steps
     */
    private async postAndroidTenFingerPrintSetup(pin: number){
        await this.reEnterPin(pin);
        if (this.platformVersion >= 14) {
            await this.waitAndTap('Pixel Imprint');
        }
        if (this.platformVersion >= 12) {
            await this.waitAndTap('MORE');
            await this.waitAndTap('I AGREE');
        } else {
            await this.waitAndTap('NEXT');
        }
    }

    /**
     * Re-enter pin and submit screen
     */
    private async reEnterPin(pin: number) {
        await (await this.findAndroidElementByMatchingText('Re-enter your PIN')).waitForDisplayed({ timeout: 10*1000 });
        await this.executeAdbCommand(`input text ${pin} && input keyevent 66`);
    }

    /**
     * Touch the fingerprint sensor and enable it
     */
    private async touchFingerPrintSensor(touchCode: number) {
        // Touch the sensor for the first time to trigger finger print
        await (await this.findAndroidElementByMatchingText('Touch the sensor.*')).waitForDisplayed({ timeout: 10*1000 });
        await driver.fingerPrint(touchCode);

        // Add finger print
        await (await this.findAndroidElementByMatchingText('Put your finger.*')).waitForDisplayed({ timeout: 10*1000 });
        await driver.fingerPrint(touchCode);

        // Confirm finger print
        await (await this.findAndroidElementByMatchingText('Keep lifting.*')).waitForDisplayed({ timeout: 10*1000 });
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
     * Find an Android element based on text that matches a regular expression which is case insensitive
     */
    async findAndroidElementByMatchingText(string: string) {
        const selector = `android=new UiSelector().textMatches("(?i)${string}")`;

        return $(selector);
    }

    /**
     * Wait on an element
     */
    async waitForMatchingElement(string: string) {
        await (await this.findAndroidElementByMatchingText(string)).waitForDisplayed({ timeout: 10*1000 });
    }
    /**
     * Wait and click on an element
     */
    async waitAndTap(string: string) {
        await this.waitForMatchingElement(string);
        await (await this.findAndroidElementByMatchingText(string)).click();
    }

    /**
     * Close the settings Screen lock notifications
     */
    async closeSettingsScreenLockNotifications(){
        try {
            if (await (await this.findAndroidElementByMatchingText('Set screen lock')).isDisplayed()){
                await $('android=new UiSelector().descriptionContains("Dismiss")').click();
                await $('android=new UiSelector().textMatches("(?i)Dismiss")').click();
            }
        } catch (ign) { /* do nothing */ }
    }

    /**
     * This is the core methods to enable FingerPrint for Android. It will walk through all steps to enable
     * FingerPrint on Android 9 (2018) till the latest one all automatically for you.
     */
    async enableBiometricLogin() {
        // Open the settings screen and set screen lock to pin
        await this.executeAdbCommand(
            `am start -a android.settings.SECURITY_SETTINGS && locksettings set-pin ${DEFAULT_PIN}`,
        );
        // As of Android 14 there is a new flow to enable finger print
        if (this.platformVersion >= 14) {
            // There might be two Device unlock options, the first is the notification, the second is the actual setting
            // First wait for the right screen to be shown
            await this.waitForMatchingElement('Device unlock.*');
            // Android 14 might have notifications that might block searching the right element, so we need to close them
            await this.closeSettingsScreenLockNotifications();
            await this.waitAndTap('Device unlock');
            await this.waitAndTap('.*Fingerprint.*Unlock');
        } else {
            await this.waitAndTap('.*Fingerprint.*');
        }
        await this.fingerPrintWizard(DEFAULT_PIN);

    }
}

export default new AndroidSettings();
