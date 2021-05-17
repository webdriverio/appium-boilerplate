import AppScreen from './AppScreen';

class FormsScreen extends AppScreen {
    constructor () {
        super('~Forms-screen');
    }

    get input ():WebdriverIO.Element {return $('~text-input');}
    get inputTextResult ():WebdriverIO.Element {return $('~input-text-result');}
    get switch ():WebdriverIO.Element {return $('~switch');}
    get switchText ():WebdriverIO.Element {return $('~switch-text');}
    get dropDown ():WebdriverIO.Element {return $('~Dropdown');}
    get activeButton ():WebdriverIO.Element {return $('~button-Active');}
    get inActiveButton ():WebdriverIO.Element {return $('~button-Inactive');}

    /**
     * Return if the switch is active or not active for iOS / Android
     * For Android the switch is `ON|OFF`, for iOS '1|0'
     */
    isSwitchActive ():boolean {
        const active = driver.isAndroid ? 'ON' : '1';

        return this.switch.getText().includes(active);
    }

    /**
     * Get the text of the drop down component
     */
    getDropDownText ():string {
        // We need to do some magic here to get the value of the dropdown for Android and for iOS
        // return getTextOfElement(this.dropDown);
        // For Android the selected value can be found with this XPATH
        // `//android.view.ViewGroup[@content-desc="Dropdown"]/android.view.ViewGroup/android.widget.EditText`
        // Which is `//*[@content-desc="Dropdown"]/*/android.widget.EditText` so it's let element dependent
        let selector;

        if (driver.isAndroid) {
            selector ='//*[@content-desc="Dropdown"]/*/android.widget.EditText';
        } else {
            // **/*[`name == "Dropdown"`]/**/*[`name == "text_input"`]
            // For iOS we can use XPATH to the the text, this will be `//XCUIElementTypeTextField[@name="text_input"]`
            // The downside is that it will take at least 500ms to find the element. We can also use a less brittle
            // selector which is also faster. This is the `ios class chain` selector. To make it more robust
            // we need to use the following selector.
            selector = '-ios class chain:**/*[`name == "Dropdown"`]/**/*[`name == "text_input"`]';
        }

        return $(selector).getText();
    }
}

export default new FormsScreen();
