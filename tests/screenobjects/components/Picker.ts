import { TIMEOUTS } from '../../helpers/Constants.js';

const SELECTORS = {
    // The Android platform picker dialog exposes no resource-id or accessibility id,
    // so a UiAutomator2 className match is the most stable locator available here.
    ANDROID_LISTVIEW: 'android=new UiSelector().className("android.widget.ListView")',
    IOS_PICKERWHEEL: '-ios predicate string:type == \'XCUIElementTypePickerWheel\'',
    DONE: '~done_button',
    /** Select an Android picker item by its exact visible text label. */
    byText: (value: string) => `android=new UiSelector().text("${value}")`,
};

class Picker {
    /**
     * Wait for the picker to be shown
     */
    static async waitForIsShown (isShown = true) {
        const selector = driver.isIOS ? SELECTORS.IOS_PICKERWHEEL : SELECTORS.ANDROID_LISTVIEW;
        await $(selector).waitForExist({
            timeout: TIMEOUTS.SHORT_PLUS,
            reverse: !isShown,
            timeoutMsg: `Picker not ${isShown ? 'shown' : 'hidden'} within ${TIMEOUTS.SHORT_PLUS / 1000}s`,
        });
    }

    /**
     * Select a value from the picker
     */
    static async selectValue (value:string) {
        await this.waitForIsShown(true);
        if (driver.isIOS) {
            await this.setIOSValue(value);
        } else {
            await this.setAndroidValue(value);
        }
        await this.waitForIsShown(false);
    }

    /**
     * Set the value for Android
     */
    private static async setAndroidValue (value:string) {
        await $(SELECTORS.byText(value)).click();
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
