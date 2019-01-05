import TabBar from '../screenobjects/components/tab.bar';
import WebViewScreen from '../screenobjects/webview.screen';
import { timeDifference } from '../helpers/utils';

describe('WebdriverIO and Appium', () => {
    let start;
    beforeEach(() => {
        browser.reset();
        TabBar.waitForTabBarShown(true);
        TabBar.openWebView();
        start = Date.now();
    });

    /**
     * CHECK THE CONSOLE FOR THE TIME DIFFERENCE BETWEEN
     * WAITING FOR THE WEBVIEW TO BE LOADED WITH XPATH
     * AND WAITING FOR THE WEBVIEW TO BE LOADED IN A FASTER WAY
     *
     * THIS IS JUST ONE EXAMPLE IN THE DIFFERENCE BETWEEN USING
     * XPATH OR A DIFFERENT LOCATOR STRATEGY
     */
    it('should be able to go to the webview by xpath', () => {
        WebViewScreen.waitForWebViewIsDisplayedByXpath();
        const end = Date.now();
        timeDifference(start, end);
    });

    it('should be able to go to the webview faster', () => {
        WebViewScreen.waitForWebViewContextLoaded();
        const end = Date.now();
        timeDifference(start, end);
    });
});
