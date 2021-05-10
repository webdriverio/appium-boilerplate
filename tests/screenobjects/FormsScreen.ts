import NativeAlert from '../helpers/NativeAlert';
import Picker from '../helpers/Picker';
import { getTextOfElement } from '../helpers/Utils';
import AppScreen from './AppScreen';

const SELECTORS = {
    FORMS_SCREEN: '~Forms-screen',
    INPUT: '~text-input',
    INPUT_TEXT: '~input-text-result',
    SWITCH: '~switch',
    SWITCH_TEXT: '~switch-text',
    DROP_DOWN: '~select-Dropdown',
    ACTIVE_BUTTON: '~button-Active',
    IN_ACTIVE_BUTTON: '~button-Inactive',
};

class FormsScreen extends AppScreen {
    constructor () {
        super(SELECTORS.FORMS_SCREEN);
    }

    get input ():WebdriverIO.Element {
        return $(SELECTORS.INPUT);
    }

    get inputTextResult ():WebdriverIO.Element {
        return $(SELECTORS.INPUT_TEXT);
    }

    get switch ():WebdriverIO.Element {
        return $(SELECTORS.SWITCH);
    }

    get switchText ():WebdriverIO.Element {
        return $(SELECTORS.SWITCH_TEXT);
    }

    /**
     * Return if the switch is active or not active for iOS / Android
     * For Android the switch is `ON|OFF`, for iOS '1|0'
     */
    isSwitchActive ():boolean {
        const active = driver.isAndroid ? 'ON' : '1';

        return this.switch.getText() === active;
    }

    get dropDown ():WebdriverIO.Element {
        return $(SELECTORS.DROP_DOWN);
    }

    /**
     * Get the text of the drop down component
     */
    getDropDownText ():string {
        return getTextOfElement($(SELECTORS.DROP_DOWN));
    }

    get picker ():Picker {
        return Picker;
    }

    get activeButton ():WebdriverIO.Element {
        return $(SELECTORS.ACTIVE_BUTTON);
    }

    get inActiveButton ():WebdriverIO.Element {
        return $(SELECTORS.IN_ACTIVE_BUTTON);
    }

    get alert ():NativeAlert {
        return NativeAlert;
    }
}

export default new FormsScreen();
