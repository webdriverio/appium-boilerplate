const SELECTORS = {
    ANDROID_LISTVIEW: '//android.widget.ListView',
    IOS_PICKERWHEEL: '-ios predicate string:type == \'XCUIElementTypePickerWheel\'',
    DONE: '~done_button',
};

class Picker {
    /**
     * Wait for the picker to be shown
     */
    static waitForIsShown (isShown = true) {
        // iOS and Android have different elements we need to interact with
        // we determine the selector here
        const selector = driver.isIOS ? SELECTORS.IOS_PICKERWHEEL : SELECTORS.ANDROID_LISTVIEW;
        $(selector).waitForExist({
            timeout: 11000,
            reverse: !isShown,
        });
    }

    /**
     * Select a value from the picker
     */
    static selectValue (value:string) {
        // Wait for the picker to be shown
        this.waitForIsShown(true);
        // There is a differnce between setting the value for iOS and Android
        if (driver.isIOS) {
            this.setIOSValue(value);
        } else {
            this.setAndroidValue(value);
        }
        // Wait for the picker to be gone
        this.waitForIsShown(false);
    }

    /**
     * Set the value for Android
     */
    private static setAndroidValue (value:string) {
        // For Android we can click on a value, if it's in the list, based on the text
        $(`${SELECTORS.ANDROID_LISTVIEW}/*[@text='${value}']`).click();
    }

    /**
     * Set the value for IOS
     */
    private static setIOSValue (value: string) {
        $(SELECTORS.IOS_PICKERWHEEL).addValue(value);
        $(SELECTORS.DONE).click();
    }
}

export default Picker;
