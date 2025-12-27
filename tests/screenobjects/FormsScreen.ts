import AppScreen from './AppScreen.js';

const SELECTORS = {
    SCREEN: '//*[@name="Forms-screen"]',
};

class FormsScreen extends AppScreen {
    constructor () {
        super(SELECTORS.SCREEN);
    }

    get screen () {return $(SELECTORS.SCREEN);}
    get input () {return $('//*[@name="text-input"]');}
    get inputTextResult () {return $('//*[@name="input-text-result"]');}
    get switch () {return $('//*[@name="switch"]');}
    get switchText () {return $('//*[@name="switch-text"]');}
    get dropDown() { return $('//*[@name="Dropdown"]'); }
    get dropDownChevron() { return $('//*[@name="dropdown-chevron"]'); }
    get activeButton () {return $('//*[@name="button-Active"]');}
    get inActiveButton () {return $('//*[@name="button-Inactive"]');}

    async tapOnInputTextResult(){
        await this.inputTextResult.click();
    }

    async tapOnSwitch(){
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
        await this.activeButton.click();
    }

    async tapOnInActiveButton(){
        await this.inActiveButton.click();
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
        let selector;

        if (driver.isAndroid) {
            selector ='//*[@content-desc="Dropdown"]//android.widget.EditText';
        } else {
            // For iOS we use XPath to get the text, this will be `//XCUIElementTypeTextField[@name="text_input"]`
            // The XPath selector finds the text_input field within the Dropdown element
            selector = '//*[@name="Dropdown"]//XCUIElementTypeTextField[@name="text_input"]';
        }

        return $(selector).getText();
    }
}

export default new FormsScreen();
