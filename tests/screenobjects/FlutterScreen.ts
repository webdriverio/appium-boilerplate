import { byValueKey } from 'appium-flutter-finder';

export default class FlutterScreen {
    private selector: string;

    constructor(selector: string) {
        this.selector = selector;
    }


    /**
     * Wait for the screen element to be visible
     *
     * @param {boolean} isShown
     */
    async waitForIsShown(isShown = true): Promise<boolean | void> {
        return $(this.selector).waitForDisplayed({
            reverse: !isShown,
        });
    }

    /**
     * Ensure the execution context is set to FLUTTER
     */
    async ensureFlutterContext(): Promise<void> {
        const currentContext = await driver.getContext();
        if (currentContext !== 'FLUTTER') {
            await driver.switchContext('FLUTTER');
        }
    }
}
