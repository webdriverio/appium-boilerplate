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
    DROPDOWN_VALUE_ANDROID: '//*[@content-desc="Dropdown"]//android.widget.EditText',
    DROPDOWN_VALUE_IOS: '-ios class chain:**/*[`name == "Dropdown"`]/**/*[`name == "text_input"`]',
};

class FormsScreen extends AppScreen {
    constructor () {
        super(SELECTORS.SCREEN);
    }

    get screen () {return $(SELECTORS.SCREEN);}
    get input () {return $(SELECTORS.INPUT);}
    get inputTextResult () {return $(SELECTORS.INPUT_RESULT);}
    get switch () {return $(SELECTORS.SWITCH);}
    get switchText () {return $(SELECTORS.SWITCH_TEXT);}
    get dropDown() { return $(SELECTORS.DROPDOWN); }
    get dropDownChevron() { return $(SELECTORS.DROPDOWN_CHEVRON); }
    get activeButton () {return $(SELECTORS.ACTIVE_BUTTON);}
    get inActiveButton () {return $(SELECTORS.INACTIVE_BUTTON);}

    async tapOnInputTextResult(){
        await this.waitForIsShown(true);
        await this.inputTextResult.click();
    }

    async tapOnSwitch(){
        await this.waitForIsShown(true);
        await this.switch.click();
    }

    async tapOnDropDown() {
        // The tap action on the complete dropdown doesn't work on iOS, we need to
        // tap on the chevron to open it
        if(driver.isIOS) {
            return await this.dropDownChevron.click();
        }

        return await this.dropDown.click();
    }

    async tapOnActiveButton(){
        await this.activeButton.waitForEnabled({ timeoutMsg: 'Active button not enabled within timeout' });
        await this.activeButton.click();
    }

    async tapOnInActiveButton(){
        await this.inActiveButton.click();
    }

    async waitForDropDownValue(expected: string) {
        await driver.waitUntil(
            async () => (await this.getDropDownText()) === expected,
            { timeout: 5000, interval: 200, timeoutMsg: `Dropdown did not show "${expected}" within 5s` },
        );
    }

    /**
     * Return if the switch is active or not active for iOS / Android
     * For Android the switch is `"true"|"false"`, for iOS '1|0'
     */
    async isSwitchActive ():Promise<boolean> {
        return driver.isAndroid ? (await this.switch.getAttribute('checked')) === 'true' : (await this.switch.getText()) === '1';
    }

    /**
     * Get the text of the drop down component
     */
    async getDropDownText ():Promise<string> {
        // We need to do some magic here to get the value of the dropdown for Android and for iOS
        // return getTextOfElement(this.dropDown);
        // For Android the selected value can be found with this XPATH
        // `//android.view.ViewGroup[@content-desc="Dropdown"]/android.view.ViewGroup/android.widget.EditText`
        // Which is `//*[@content-desc="Dropdown"]//android.widget.EditText` so it's let element dependent
        // Android: XPath to EditText within the Dropdown content-desc container
        // iOS: class chain selector (faster and more robust than XPath)
        return $(driver.isAndroid ? SELECTORS.DROPDOWN_VALUE_ANDROID : SELECTORS.DROPDOWN_VALUE_IOS).getText();
    }
}

export default new FormsScreen();
