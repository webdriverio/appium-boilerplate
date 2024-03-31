const SELECTORS = {
    ANDROID: {
        ALERT_TITLE: '*//android.widget.TextView[@resource-id="android:id/alertTitle"]',
        ALERT_MESSAGE: '*//android.widget.TextView[@resource-id="android:id/message"]',
        ALERT_BUTTON: '*//android.widget.Button[@text="{BUTTON_TEXT}"]',
    },
    IOS: {
        ALERT: '-ios predicate string:type == \'XCUIElementTypeAlert\'',
    },
};

type IOSAlertPermissionDialog = {buttonAmount?:number, buttonText?:string, timeout?:number}

class NativeAlert {
    // IMPORTANT:
    // The Alerts/Permissions for iOS have issues. As of `appium-xcuitest-driver` V6 the normal `getAlert`-methods are not working. This is still
    // an issue in the latest driver (7.8.2). The issue is that the alert is only shown in the scope outside of the app, take for
    // example the home screen (com.apple.springboard)
    // See:
    // - https://github.com/appium/appium-xcuitest-driver/issues/2311
    // - https://github.com/appium/appium-xcuitest-driver/issues/2349

    /**
     * Wait for the alert to exist.
     *
     * The selector for Android differs from iOS
     */
    static async waitForIsShown (isShown = true) {
        const selector = driver.isAndroid
            ? SELECTORS.ANDROID.ALERT_TITLE
            : SELECTORS.IOS.ALERT;

        // Due to the iOS driver issue we need to wait for the alert in a different way
        if (driver.isIOS){
            return this.waitForIOSAlertPermissionDialog({ timeout: 11000, buttonAmount: isShown ? 1 : 0 });
        }

        return $(selector).waitForExist({
            timeout: 11000,
            reverse: !isShown,
        });
    }

    /**
     * Get the buttons of the iOS alert/permission
     */
    static async getIOSAlertPermissionDialogButtons(){
        return (await driver.execute('mobile: alert', { action: 'getButtons' })) as string[];
    }

    /**
     * Wait for the alert/permission to exist based on it's label, or the amount of buttons
     * The buttonText can be a string of a regex so we can check on for example "Allow|OK" which can be different
     * between iOS versions
     */
    static async waitForIOSAlertPermissionDialog({ buttonAmount, buttonText, timeout = 3000 }:IOSAlertPermissionDialog){
        if (!buttonText && buttonAmount === undefined) {
            throw new Error('Provide either buttonText or the amount of expected buttons to wait for!');
        }

        // If the amount of buttons is 0, then we need to wait for the alert to disappear. Normally we can wait for the alert not to exist
        // but due to the error for iOS we need to:
        // - wait for the alert to exist (even though we know it's not there), we will use 1 second for it
        // - get the buttons, which will throw an error if the alert is not there like
        //   `no such alert: An attempt was made to operate on a modal dialog when one was not open`
        // And then return
        // If that fails, meaning there are buttons, we will not reach the catch and continue the normal flow which will then throw an error
        // because the button amount is bigger than 0 which should not be the case

        try {
            // Check if the alert is shown
            await driver.waitUntil(async () => {
                try {
                    // If there is no alert then this will throw an error
                    const buttons = await this.getIOSAlertPermissionDialogButtons();

                    if (buttons.length >= (buttonAmount as number)){
                        return true;
                    }

                    const regex = new RegExp(buttonText as string, 'i');

                    return buttons.some(button => regex.test(button));
                } catch (e) {
                    // This means that the alert is not shown/available yet. We now need to check if this is as expected
                    // because we are waiting for the alert to "disappear"
                    return buttonAmount !== undefined && buttonAmount === 0;
                }
            }, { timeout });
        } catch (e) {
            // This means that the alert is not shown
        }
    }

    /**
     * Accept the alert/permission based on it's label
     */
    static async acceptIOSAlertPermissionDialog({ buttonText, timeout = 3000 }:IOSAlertPermissionDialog){
        await this.waitForIOSAlertPermissionDialog({ buttonText, timeout });
        await driver.execute('mobile: alert', { action: 'accept' });
    }

    /**
     * Press a button in a cross-platform way.
     *
     * IOS:
     *  iOS always has an accessibilityID so use the `~` in combination
     *  with the name of the button as shown on the screen
     * ANDROID:
     *  Use the text of the button, provide a string and it will automatically transform it to uppercase
     *  and click on the button
     */
    static async topOnButtonWithText (selector: string) {
        const buttonSelector = driver.isAndroid
            ? SELECTORS.ANDROID.ALERT_BUTTON.replace(/{BUTTON_TEXT}/, selector.toUpperCase())
            : `~${selector}`;

        if (driver.isIOS) {
            await this.acceptIOSAlertPermissionDialog({ buttonText: selector, timeout: 3000 });
        }
        await $(buttonSelector).click();
    }

    /**
     * Get the alert text
     *
     * iOS:
     *  The default Appium method can be used to get the text of the alert
     * Android:
     *  The UI hierarchy for Android is different so it will not give the same result as with
     *  iOS if `getText` is being used. Here we construct a method that would give the same output.
     */
    static async text ():Promise<string> {
        if (driver.isIOS) {
            return $(SELECTORS.IOS.ALERT).getText();
        }

        return `${await $(SELECTORS.ANDROID.ALERT_TITLE).getText()}\n${await $(SELECTORS.ANDROID.ALERT_MESSAGE).getText()}`;
    }
}

export default NativeAlert;
