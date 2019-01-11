import WebView from '../helpers/WebView';

const SELECTORS = {
    WEB_VIEW_SCREEN: browser.isAndroid
        ? '*//android.webkit.WebView'
        : '*//XCUIElementTypeWebView',
};

class WebViewScreen extends WebView {
    /**
     * Wait for the screen to be displayed based on Xpath
     *
     * @param {boolean} isShown
     */
    waitForWebViewIsDisplayedByXpath (isShown = true) {
        $(SELECTORS.WEB_VIEW_SCREEN).waitForDisplayed(20000, !isShown);
    }
}

export default new WebViewScreen();
