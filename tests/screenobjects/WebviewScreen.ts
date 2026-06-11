import { TIMEOUTS } from '../helpers/Constants.js';
import WebView from '../helpers/WebView.js';

const SELECTORS = {
    // XPath intentionally used here: these are native host-container elements that have
    // no accessibility ID. This file exists to demonstrate the speed cost of XPath vs
    // context-switch (see app.webview.xpath.spec.ts) — not as a locator best-practice.
    ANDROID_WEBVIEW: '*//android.webkit.WebView',
    IOS_WEBVIEW: '*//XCUIElementTypeWebView',
    // Web-context CSS selectors — only valid after switchContext() to the webview.
    DOC_SEARCH_BUTTON: '.DocSearch',
    DOC_SEARCH_INPUT: '.DocSearch-Input',
    DOC_SEARCH_FOOTER: '.DocSearch-Footer',
    DOC_SEARCH_HITS_FOOTER: '.DocSearch-HitsFooter',
    FIRST_SEARCH_RESULT: '#docsearch-hits0-item-0 a',
    PAGE_HEADING: 'header h1',
};

class WebViewScreen extends WebView {
    /**
     * Wait for the screen to be displayed based on XPath.
     * XPath is intentional here — see selector comment above.
     */
    async waitForWebViewIsDisplayedByXpath(isShown = true): Promise<boolean | void> {
        const selector = driver.isAndroid ? SELECTORS.ANDROID_WEBVIEW : SELECTORS.IOS_WEBVIEW;

        return $(selector).waitForDisplayed({
            timeout: TIMEOUTS.VERY_LONG,
            reverse: !isShown,
            timeoutMsg: `WebView element not ${isShown ? 'displayed' : 'hidden'} within ${TIMEOUTS.VERY_LONG / 1000}s`,
        });
    }

    async openDocSearch(): Promise<void> {
        await $(SELECTORS.DOC_SEARCH_BUTTON).click();
    }

    async waitForDocSearchInput(): Promise<void> {
        await $(SELECTORS.DOC_SEARCH_INPUT).waitForDisplayed({ timeoutMsg: 'DocSearch input not shown within timeout' });
    }

    async setDocSearchQuery(query: string): Promise<void> {
        await $(SELECTORS.DOC_SEARCH_INPUT).setValue(query);
    }

    async waitForSearchResults(): Promise<void> {
        await driver.waitUntil(
            async () => (await $(SELECTORS.DOC_SEARCH_HITS_FOOTER).getText()).includes('See all'),
            { timeout: TIMEOUTS.SHORT, interval: 500, timeoutMsg: 'Search results "See all" footer not shown within timeout' },
        );
    }

    async clickFirstSearchResult(): Promise<void> {
        await $(SELECTORS.FIRST_SEARCH_RESULT).click();
    }

    async waitForPageHeading(): Promise<void> {
        await $(SELECTORS.PAGE_HEADING).waitForDisplayed({
            timeout: TIMEOUTS.SHORT,
            timeoutMsg: 'Page heading not shown within timeout',
        });
    }

    async getPageHeadingText(): Promise<string> {
        return $(SELECTORS.PAGE_HEADING).getText();
    }

    /**
     * Dismiss the DocSearch keyboard in the webview context.
     *
     * hideKeyboard() is not available in the web context — tap the footer instead.
     * The footer is always visible alongside the DocSearch input and safely receives taps.
     */
    async dismissDocSearchKeyboard(): Promise<void> {
        if (!await driver.isKeyboardShown()) return;
        await $(SELECTORS.DOC_SEARCH_FOOTER).click();
    }
}

export default new WebViewScreen();
