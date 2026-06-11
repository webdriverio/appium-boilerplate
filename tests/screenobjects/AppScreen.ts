import BaseScreen from './BaseScreen.js';

/**
 * AppScreen — base class for all native-app screen objects.
 *
 * Each screen object passes its root selector to the constructor.
 * Override `waitForIsShown` when the root selector is not reliable
 * (e.g. plain Views that are not in the accessibility tree on iOS 26.x).
 */
export default class AppScreen extends BaseScreen {
    private selector: string;

    constructor(selector: string) {
        super();
        this.selector = selector;
    }

    /**
     * Wait for this screen's root element to be shown or hidden.
     * Subclasses may override to target a more reliable element.
     */
    async waitForIsShown(isShown = true): Promise<boolean | void> {
        return $(this.selector).waitForDisplayed({
            reverse: !isShown,
            timeoutMsg: `Screen (${this.selector}) not ${isShown ? 'shown' : 'hidden'} within timeout`,
        });
    }
}
