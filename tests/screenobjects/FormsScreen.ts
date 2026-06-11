import AppScreen from './AppScreen.js';

const SELECTORS = {
    SCREEN: '~Forms-screen',
    INPUT: '~text-input',
    INPUT_RESULT: '~input-text-result',
    SWITCH: '~switch',
    SWITCH_TEXT: '~switch-text',
    DROPDOWN: '~Dropdown',
    DROPDOWN_CHEVRON: '~dropdown-chevron',
    ACTIVE_BUTTON: '~button-Active',
    INACTIVE_BUTTON: '~button-Inactive',
    DROPDOWN_VALUE_ANDROID: 'android=new UiSelector().descriptionContains("Dropdown").childSelector(new UiSelector().className("android.widget.EditText"))',
    DROPDOWN_VALUE_IOS: '-ios class chain:**/*[`name == "Dropdown"`]/**/*[`name == "text_input"`]',
};

class FormsScreen extends AppScreen {
    constructor () {
        super(SELECTORS.SCREEN);
    }

    // ~Forms-screen is a plain View on iOS 26.x — not in the accessibility tree. Use text-input instead.
    override async waitForIsShown (isShown = true): Promise<boolean | void> {
        return $(SELECTORS.INPUT).waitForDisplayed({
            reverse: !isShown,
            timeoutMsg: `Screen (Forms) not ${isShown ? 'shown' : 'hidden'} within timeout`,
        });
    }

    get screen () {return $(SELECTORS.SCREEN);}
    get input () {return $(SELECTORS.INPUT);}
    get inputTextResult () {return $(SELECTORS.INPUT_RESULT);}
    get switch () {return $(SELECTORS.SWITCH);}
    get switchText () {return $(SELECTORS.SWITCH_TEXT);}
    get dropDown () {return $(SELECTORS.DROPDOWN);}
    private get dropDownChevron () {return $(SELECTORS.DROPDOWN_CHEVRON);}
    get activeButton () {return $(SELECTORS.ACTIVE_BUTTON);}
    get inActiveButton () {return $(SELECTORS.INACTIVE_BUTTON);}
    private get dropDownValue () {
        return $(driver.isAndroid ? SELECTORS.DROPDOWN_VALUE_ANDROID : SELECTORS.DROPDOWN_VALUE_IOS);
    }

    async tapOnInputTextResult(){
        await this.inputTextResult.click();
    }

    async tapOnSwitch(){
        await this.switch.click();
    }

    async tapOnDropDown(){
        // On iOS 26.x the tap must target the chevron to open the native PickerWheel;
        // clicking the container element directly does not trigger the picker.
        if (driver.isIOS) {
            return this.dropDownChevron.click();
        }
        return this.dropDown.click();
    }

    async tapOnActiveButton(){
        await this.activeButton.click();
    }

    async tapOnInActiveButton(){
        await this.inActiveButton.click();
    }

    /**
     * Dismiss the keyboard after typing in the input field.
     * Taps the input-result area — a safe native-element target that also
     * dismisses the keyboard without triggering any side-effects.
     */
    async dismissKeyboardAfterInput(): Promise<void> {
        await this.dismissKeyboard(this.inputTextResult);
    }

    async isSwitchActive ():Promise<boolean> {
        return driver.isAndroid
            ? (await this.switch.getAttribute('checked')) === 'true'
            : (await this.switch.getText()) === '1';
    }

    async getDropDownText ():Promise<string> {
        return this.dropDownValue.getText();
    }
}

export default new FormsScreen();
