import { CONTEXT_REF } from '../constants';
import WebView from '../helpers/WebView';

const SELECTORS = {
    // WEB_VIEW_SCREEN: '*//XCUIElementTypeWebView',
    WEB_VIEW_SCREEN: '//XCUIElementTypeOther[@name="WEBDRIVER I/O Demo app for the appium-boilerplate   Support"]/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeWebView',
};

export default class WebViewScreen extends WebView{
    /**
     * Wait for the screen to be visible based on Xpath
     *
     * @param {boolean} isShown
     */
    static waitForScreenIsShownByXpath(isShown = true) {
        browser.waitForVisible(SELECTORS.WEB_VIEW_SCREEN, 20000, !isShown);
    }

    /**
     * Wait for the website in the webview to be loaded
     *
     * explain this
     */
    static waitForWebsiteLoaded() {
        this.waitForWebViewContextLoaded();
        this.switchToContext(CONTEXT_REF.WEBVIEW);
        this.waitForDocumentFullyLoaded();
        this.switchToContext(CONTEXT_REF.NATIVE);
    }
}
