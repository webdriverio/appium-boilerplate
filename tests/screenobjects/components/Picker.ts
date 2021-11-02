const SELECTORS = {
    ANDROID_LISTVIEW: '//android.widget.ListView',
    IOS_PICKERWHEEL: '-ios predicate string:type == \'XCUIElementTypePickerWheel\'',
    DONE: '~done_button',
};

class Picker {
    /**
     * Wait for the picker to be shown
     */
    static async waitForIsShown (isShown = true) {
        // iOS and Android have different elements we need to interact with
        // we determine the selector here
        const selector = driver.isIOS ? SELECTORS.IOS_PICKERWHEEL : SELECTORS.ANDROID_LISTVIEW;
        await $(selector).waitForExist({
            timeout: 11000,
            reverse: !isShown,
        });
    }

    /**
     * Select a value from the picker
     */
    static async selectValue (value:string) {
        // Wait for the picker to be shown
        await this.waitForIsShown(true);
        // There is a difference between setting the value for iOS and Android
        if (driver.isIOS) {
            await this.setIOSValue(value);
        } else {
            await this.setAndroidValue(value);
        }
        // Wait for the picker to be gone
        await this.waitForIsShown(false);
    }

    /**
     * Set the value for Android
     */
    private static async setAndroidValue (value:string) {
        // For Android we can click on a value, if it's in the list, based on the text
        await $(`${SELECTORS.ANDROID_LISTVIEW}/*[@text='${value}']`).click();
    }

    /**
     * Set the value for IOS
     */
    private static async setIOSValue (value: string) {
        await $(SELECTORS.IOS_PICKERWHEEL).addValue(value);
        await $(SELECTORS.DONE).click();
    }
}

export default Picker;
