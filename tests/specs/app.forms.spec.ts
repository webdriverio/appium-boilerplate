import TabBar from '../screenobjects/components/TabBar.js';
import FormScreen from '../screenobjects/FormsScreen.js';
import Picker from '../screenobjects/components/Picker.js';
import NativeAlert from '../screenobjects/components/NativeAlert.js';

describe('WebdriverIO and Appium, when interacting with form elements,', () => {
    beforeEach(async () => {
        await TabBar.waitForTabBarShown();
        await TabBar.openForms();
        await FormScreen.waitForIsShown(true);
    });

    it('should be able type in the input and validate the text', async () => {
        const text = 'Hello, this is a demo app';

        await FormScreen.input.setValue(text);
        await expect(FormScreen.inputTextResult).toHaveText(
            expect.stringContaining(text)
        );

        // The app persists keyboard state between tests — dismiss if still visible.
        await FormScreen.dismissKeyboardAfterInput();
    });

    it('should be able turn on and off the switch', async () => {
        await expect(await FormScreen.isSwitchActive()).toEqual(false);

        await FormScreen.tapOnSwitch();
        await expect(await FormScreen.isSwitchActive()).toEqual(true);

        await FormScreen.tapOnSwitch();
        await expect(await FormScreen.isSwitchActive()).toEqual(false);
    });

    it('should be able select a value from the select element', async () => {
        const valueOne = 'This app is awesome';
        const valueTwo = 'webdriver.io is awesome';
        const valueThree = 'Appium is awesome';

        await FormScreen.tapOnDropDown();
        await Picker.selectValue(valueOne);
        await expect(await FormScreen.getDropDownText()).toContain(valueOne);

        await FormScreen.tapOnDropDown();
        await Picker.selectValue(valueTwo);
        await expect(await FormScreen.getDropDownText()).toContain(valueTwo);

        await FormScreen.tapOnDropDown();
        await Picker.selectValue(valueThree);
        await expect(await FormScreen.getDropDownText()).toContain(valueThree);
    });

    it('should be able to open the alert and close it with all 3 buttons', async () => {
        // This uses the "new" `scrollIntoView` method that now also supports native apps
        await FormScreen.activeButton.scrollIntoView({
            maxScrolls: 2,
            scrollableElement: FormScreen.screen,
        });
        await FormScreen.tapOnActiveButton();
        await NativeAlert.waitForIsShown(true);
        await expect(await NativeAlert.text()).toContain('This button is');

        /**
         * The following steps don't contain any assertions. This might look strange, but
         * the `waitForIsShown`-method is the verification. If the element is there, it will
         * click on it, and we can also verify if the element is not there. Both can be seen
         * as assertions so we don't need to do double assertions per action (wait for the element
         * to be there, and when it's there, expect that it's there)
         */
        await NativeAlert.tapOnButtonWithText('Ask me later');
        await NativeAlert.waitForIsShown(false);
        await FormScreen.tapOnActiveButton();
        await NativeAlert.waitForIsShown(true);
        await NativeAlert.tapOnButtonWithText('Cancel');
        await NativeAlert.waitForIsShown(false);
        await FormScreen.tapOnActiveButton();
        await NativeAlert.waitForIsShown(true);
        await NativeAlert.tapOnButtonWithText('OK');
        await NativeAlert.waitForIsShown(false);
    });

    it('should be able to determine that the inactive button is inactive', async () => {
        // Depending on the size of the screen we might need to scroll. This methods determines if it's visible,
        // if not, it will automatically scroll to find it. This will be done two times.
        // This uses the "new" `scrollIntoView` method that now also supports native apps
        await FormScreen.inActiveButton.scrollIntoView({
            maxScrolls: 2,
            scrollableElement: FormScreen.screen,
        });
        // In this case the button can't be asked if it is active or not with
        // `expect(FormScreen.inActiveButton.isEnabled()).toEqual(false);`
        // So use a click and check if shown, make sure the alert is not there
        await NativeAlert.waitForIsShown(false);
        await FormScreen.tapOnInActiveButton();
        // waitForIsShown(false) retries until the element is not displayed — covers the "did it appear?" check
        await NativeAlert.waitForIsShown(false);
    });
});
