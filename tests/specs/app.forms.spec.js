import Gestures from '../helpers/Gestures';
import TabBar from '../screenobjects/components/tab.bar';
import FormScreen from '../screenobjects/forms.screen';
import LoginScreen from '../screenobjects/login.screen';

describe('Validate the form elements', () => {
    beforeEach(() => {
        TabBar.waitForTabBarShown(true);
    });

    it('should be able type in the input and validate the text', () => {
        const text = 'Hello, this is a demo app';

        TabBar.openForms();
        FormScreen.waitForIsShown(true);
        FormScreen.input.setValue(text);
        expect(FormScreen.inputTextResult.getText()).toEqual(text);
        if (browser.isKeyboardShown()) {
            browser.hideDeviceKeyboard();
        }
    });

    it('should be able turn on and off the switch', () => {
        TabBar.openForms();
        FormScreen.waitForIsShown(true);
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

        TabBar.openForms();
        FormScreen.waitForIsShown(true);
        FormScreen.dropDown.click();
        FormScreen.picker.selectValue(valueOne);
        expect(FormScreen.getDropDownText()).toContain(valueOne);
        FormScreen.dropDown.click();
        FormScreen.picker.selectValue(valueTwo);
        expect(FormScreen.getDropDownText()).toContain(valueTwo);
        FormScreen.dropDown.click();
        FormScreen.picker.selectValue(valueThree);
        expect(FormScreen.getDropDownText()).toContain(valueThree);
    });

    it('should be able to open the alert and close it with all 3 buttons', () => {
        TabBar.openForms();
        FormScreen.waitForIsShown(true);
        Gestures.checkIfVisibleWithScrollDown(FormScreen.activeButton, 2);
        FormScreen.activeButton.click();
        FormScreen.alert.waitForIsShown(true);
        expect(LoginScreen.alert.text()).toEqual('This button is\nThis button is active');
        FormScreen.alert.pressButton('Ask me later');
        FormScreen.alert.waitForIsShown(false);
        FormScreen.activeButton.click();
        FormScreen.alert.waitForIsShown(true);
        FormScreen.alert.pressButton('Cancel');
        FormScreen.alert.waitForIsShown(false);
        FormScreen.activeButton.click();
        FormScreen.alert.waitForIsShown(true);
        FormScreen.alert.pressButton('OK');
        FormScreen.alert.waitForIsShown(false);
    });

    it('should be able to determine that the inactive button is inactive', () => {
        TabBar.openForms();
        FormScreen.waitForIsShown(true);
        Gestures.checkIfVisibleWithScrollDown(FormScreen.inActiveButton, 2);
        // In this case the button can't be asked if it is active or not with
        // `expect(FormScreen.inActiveButton.isEnabled()).toEqual(false);`
        // So use a click and check if shown, make sure the alert is not there
        FormScreen.alert.waitForIsShown(false);
        FormScreen.inActiveButton.click();
        // Just wait 1 second to be sure it didn't appear
        browser.pause(1000);
        // Now validate it isn't there
        FormScreen.alert.waitForIsShown(false);
    });
});
