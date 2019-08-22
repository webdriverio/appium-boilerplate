const SELECTORS = {
    ANDROID_LISTVIEW: '//android.widget.ListView',
    IOS_PICKERWHEEL: '-ios predicate string:type == \'XCUIElementTypePickerWheel\'',
    DONE: `~header-Dropdown`,
};

class Picker {
    /**
     * Wait for the picker to be shown
     *
     * @param {boolean} isShown
     */
    static waitForIsShown (isShown = true) {
        const selector = driver.isIOS ? SELECTORS.IOS_PICKERWHEEL : SELECTORS.ANDROID_LISTVIEW;
        $(selector).waitForExist(11000, !isShown);
    }

    /**
     * Select a value from the picker
     *
     * @param {string} value The value that needs to be selected
     */
    static selectValue (value) {
        this.waitForIsShown(true);
        if (driver.isIOS) {
            this._setIosValue(value);
        } else {
            this._setAndroidValue(value);
        }
        this.waitForIsShown(false);
    }

    /**
     * Set the value for Android
     *
     * @param {string} value
     *
     * @private
     */
    static _setAndroidValue (value) {
        $(`${SELECTORS.ANDROID_LISTVIEW}/*[@text='${value}']`).click();
    }

    /**
     * Set the value for IOS
     *
     * @param {string} value
     *
     * @private
     */
    static _setIosValue (value) {
        $(SELECTORS.IOS_PICKERWHEEL).addValue(value);
        $(SELECTORS.DONE).click();
    }
}

export default Picker;
