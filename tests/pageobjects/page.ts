import BaseScreen from '../screenobjects/BaseScreen.js';

/**
 * Page — base class for all web page objects.
 *
 * Extends BaseScreen so both native and web screen objects share the same
 * `waitForIsShown` contract and `dismissKeyboard` helper.
 */
export default class Page extends BaseScreen {
    /**
     * Navigates to a sub-path of baseUrl.
     */
    async open(path: string): Promise<void> {
        await browser.url(path);
    }

    /**
     * Web pages are "shown" when the document is fully loaded.
     * Override in a subclass to assert on a specific element if needed.
     */
    async waitForIsShown(isShown = true): Promise<boolean | void> {
        if (!isShown) return; // no standard "not shown" check for a web page
        await browser.waitUntil(
            async () => (await browser.execute(() => document.readyState)) === 'complete',
            { timeoutMsg: 'Page not fully loaded within timeout' },
        );
    }
}
