import WebView from '../helpers/WebView';

class WebViewScreen extends WebView {
    /**
     * Wait for the screen to be displayed based on Xpath
     */
    waitForWebViewIsDisplayedByXpath (isShown = true): boolean|void {
        const selector =  browser.isAndroid ? '*//android.webkit.WebView' : '*//XCUIElementTypeWebView';
        $(selector).waitForDisplayed({
            timeout: 45000,
            reverse: !isShown,
        });
    }
}

export default new WebViewScreen();
