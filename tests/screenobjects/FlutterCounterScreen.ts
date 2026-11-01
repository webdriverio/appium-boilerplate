import { byValueKey, byTooltip, byText } from 'appium-flutter-finder';
import FlutterScreen from './FlutterScreen.js';

class FlutterCounterScreen extends FlutterScreen {
    constructor() {
        super(byValueKey('counter_screen'));
    }
    /**
     * Getters with Flutter Finders
     */
    get title() {
        return $(byText('Flutter Demo Home Page'));
    }

    get counterText() {
        return $(byValueKey('counter_value'));
    }

    get incrementBtn() {
        return $(byTooltip('Increment'));
    }

    get resetBtn() {
        return $(byValueKey('reset_button'));
    }

    /**
     * Actions
     */
    async tapIncrement(): Promise<void> {
        await this.incrementBtn.click();
    }

    async getCounterValue(): Promise<string> {
        return this.counterText.getText();
    }
}

export default new FlutterCounterScreen();
