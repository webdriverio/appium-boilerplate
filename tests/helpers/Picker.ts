const SELECTORS = {
    ANDROID_LISTVIEW: '//android.widget.ListView',
    IOS_PICKERWHEEL: '-ios predicate string:type == \'XCUIElementTypePickerWheel\'',
    DONE: '~header-Dropdown',
};

class Picker {
    /**
     * Wait for the picker to be shown
     *
     * @param {boolean} isShown
     */
    static waitForIsShown (isShown = true): void {
        const selector = driver.isIOS ? SELECTORS.IOS_PICKERWHEEL : SELECTORS.ANDROID_LISTVIEW;
        $(selector).waitForExist({
            timeout: 11000,
            reverse: !isShown,
        });
    }

    /**
     * Select a value from the picker
     */
    static selectValue (value:string):void {
        this.waitForIsShown(true);
        if (driver.isIOS) {
            this.setIosValue(value);
        } else {
            this.setAndroidValue(value);
        }
        this.waitForIsShown(false);
    }

    /**
     * Set the value for Android
     */
    private static setAndroidValue (value:string):void {
        $(`${SELECTORS.ANDROID_LISTVIEW}/*[@text='${value}']`).click();
    }

    /**
     * Set the value for IOS
     */
    private static setIosValue (value: string): void {
        $(SELECTORS.IOS_PICKERWHEEL).addValue(value);
        $(SELECTORS.DONE).click();
    }
}

export default Picker;
