import WebView from '../helpers/WebView.js';

const SELECTORS = {
    ANDROID_WEBVIEW: '*//android.webkit.WebView',
    IOS_WEBVIEW: '*//XCUIElementTypeWebView',
};

class WebViewScreen extends WebView {
    /**
     * Wait for the screen to be displayed based on Xpath
     */
    async waitForWebViewIsDisplayedByXpath (isShown = true): Promise<boolean|void> {
        const selector = browser.isAndroid ? SELECTORS.ANDROID_WEBVIEW : SELECTORS.IOS_WEBVIEW;

        return $(selector).waitForDisplayed({
            timeout: 45000,
            reverse: !isShown,
            timeoutMsg: 'WebView element not displayed within 45s',
        });
    }
}

export default new WebViewScreen();
