import TabBar from '../screenobjects/components/TabBar';
import WebViewScreen from '../screenobjects/WebviewScreen';
import { timeDifference } from '../helpers/Utils';

describe('WebdriverIO and Appium, when interacting with a webview through XPATH', () => {
    let start:number;

    beforeEach(async () => {
        await browser.reset();
        await TabBar.waitForTabBarShown();
        await TabBar.openWebView();
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
    it('should be able to verify that the WebView is shown by xpath', async () => {
        await WebViewScreen.waitForWebViewIsDisplayedByXpath();
        const end = Date.now();
        timeDifference('Test time for using XPATH', start, end);
    });

    it('should be able to verify that the WebView is shown by switching to the WebView', async () => {
        await WebViewScreen.waitForWebViewContextLoaded();
        const end = Date.now();
        timeDifference('Test time for switching to the WebView', start, end);
    });
});
