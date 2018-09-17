import WebView from '../helpers/WebView';

const SELECTORS = {
    WEB_VIEW_SCREEN: '//XCUIElementTypeOther[@name="WEBDRIVER I/O Demo app for the appium-boilerplate   Support"]/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeWebView',
};

class WebViewScreen extends WebView {
    /**
     * Wait for the screen to be visible based on Xpath
     *
     * @param {boolean} isShown
     */
    waitForScreenIsShownByXpath(isShown = true) {
        browser.waitForVisible(SELECTORS.WEB_VIEW_SCREEN, 20000, !isShown);
    }
}

export default new WebViewScreen();
