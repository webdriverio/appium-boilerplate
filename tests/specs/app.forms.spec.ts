import Gestures from '../helpers/Gestures';
import TabBar from '../screenobjects/components/TabBar';
import FormScreen from '../screenobjects/FormsScreen';
import Picker from '../screenobjects/components/Picker';
import NativeAlert from '../screenobjects/components/NativeAlert';

describe('WebdriverIO and Appium, when interacting with form elements,', () => {
    beforeEach(() => {
        TabBar.waitForTabBarShown();
        TabBar.openForms();
        FormScreen.waitForIsShown(true);
    });

    it('should be able type in the input and validate the text', () => {
        const text = 'Hello, this is a demo app';
        FormScreen.input.setValue(text);
        expect(FormScreen.inputTextResult.getText()).toEqual(text);

        /**
         * IMPORTANT!!
         *  Because the app is not closed and opened between the tests
         *  (and thus is NOT starting with the keyboard hidden)
         *  the keyboard is closed here if it is still visible.
         */
        if (driver.isKeyboardShown()) {
            /**
             * Normally we would hide the keyboard with this command `driver.hideKeyboard()`, but there is an issue for hiding the keyboard
             * on iOS when using the command. You will get an error like below
             *
             *  Request failed with status 400 due to Error Domain=com.facebook.WebDriverAgent Code=1 "The keyboard on iPhone cannot be
             *  dismissed because of a known XCTest issue. Try to dismiss it in the way supported by your application under test."
             *  UserInfo={NSLocalizedDescription=The keyboard on iPhone cannot be dismissed because of a known XCTest issue. Try to dismiss
             *  it in the way supported by your application under test.}
             *
             * That's why we click outside of the keyboard.
             */
            FormScreen.inputTextResult.click();
        }
    });

    it('should be able turn on and off the switch', () => {
        expect(FormScreen.isSwitchActive()).toEqual(false);

        FormScreen.switch.click();
        expect(FormScreen.isSwitchActive()).toEqual(true);

        FormScreen.switch.click();
        expect(FormScreen.isSwitchActive()).toEqual(false);
    });

    it('should be able select a value from the select element', () => {
        const valueOne = 'This app is awesome';
        const valueTwo = 'webdriver.io is awesome';
        const valueThree = 'Appium is awesome';

        FormScreen.dropDown.click();
        Picker.selectValue(valueOne);
        expect(FormScreen.getDropDownText()).toContain(valueOne);

        FormScreen.dropDown.click();
        Picker.selectValue(valueTwo);
        expect(FormScreen.getDropDownText()).toContain(valueTwo);

        FormScreen.dropDown.click();
        Picker.selectValue(valueThree);
        expect(FormScreen.getDropDownText()).toContain(valueThree);
    });

    it('should be able to open the alert and close it with all 3 buttons', () => {
        Gestures.checkIfDisplayedWithSwipeUp(FormScreen.activeButton, 2);
        FormScreen.activeButton.click();
        NativeAlert.waitForIsShown(true);
        expect(NativeAlert.text()).toEqual('This button is\nThis button is active');

        /**
         * The following steps don't contain any assertions. This might look strange, but
         * the `waitForIsShown`-method is the verification. If the element is there, it will
         * click on it, and we can also verify if the element is not there. Both can be seen
         * as assertions so we don't need to do double assertions per action (wait for the element
         * to be there, and when it's there, expect that it's there)
         */
        NativeAlert.pressButton('Ask me later');
        NativeAlert.waitForIsShown(false);
        FormScreen.activeButton.click();
        NativeAlert.waitForIsShown(true);
        NativeAlert.pressButton('Cancel');
        NativeAlert.waitForIsShown(false);
        FormScreen.activeButton.click();
        NativeAlert.waitForIsShown(true);
        NativeAlert.pressButton('OK');
        NativeAlert.waitForIsShown(false);
    });

    it('should be able to determine that the inactive button is inactive', () => {
        // Depending on the size of the screen we might need to scroll. This methods determines if it's visible,
        // if not, it will automatically scroll to find it. This will be done two times.
        Gestures.checkIfDisplayedWithSwipeUp(FormScreen.inActiveButton, 2);
        // In this case the button can't be asked if it is active or not with
        // `expect(FormScreen.inActiveButton.isEnabled()).toEqual(false);`
        // So use a click and check if shown, make sure the alert is not there
        NativeAlert.waitForIsShown(false);
        FormScreen.inActiveButton.click();
        // Just wait 1 second to be sure it didn't appear
        driver.pause(1000);
        // Now validate it isn't there
        NativeAlert.waitForIsShown(false);
    });
});
