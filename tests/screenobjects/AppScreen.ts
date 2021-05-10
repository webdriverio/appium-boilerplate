export default class AppScreen {
    private selector: string;

    constructor (selector: string) {
        this.selector = selector;
    }

    /**
     * Wait for the login screen to be visible
     *
     * @param {boolean} isShown
     */
    waitForIsShown (isShown = true): boolean | void {
        return $(this.selector).waitForDisplayed({
            reverse: !isShown,
        });
    }
}
