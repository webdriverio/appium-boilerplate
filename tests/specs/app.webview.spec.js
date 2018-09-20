import TabBar from '../screenobjects/components/tab.bar';
import WebViewScreen from '../screenobjects/webview.screen';
import SwipeScreen from '../screenobjects/swipe.screen';
import { CONTEXT_REF } from "../helpers/WebView";

describe('WebdriverIO and Appium, when interacting with a WebView,', () => {
    beforeEach(() =>{
        TabBar.waitForTabBarShown(true);
        TabBar.openWebView();
        WebViewScreen.waitForWebsiteLoaded();
    });

    it('should be able to open click action on the API page', () => {
        // To be able to use the site in the webview webdriver.io first needs
        // change the context from native to webview
        WebViewScreen.switchToContext(CONTEXT_REF.WEBVIEW);
        // Now the site can be accessed like you would automate a normal website
        // keep in mind the responsiveness
        // Open the API docs
        browser.click('=API');
        // And open the `click` action
        browser.waitForVisible('.navbar-toggle');
        browser.click('.navbar-toggle');
        browser.waitForVisible('=click');
        browser.click('=click');
        browser.waitForVisible('h1#click');
        expect(browser.getText('h1#click')).toEqual('CLICK');

        /**
         * IMPORTANT!!
         *  Because the app is not closed and opened between the 2 tests
         *  (and thus is NOT starting in the default context which is native)
         *  the context is here set to native. This is bad practice,
         *  because you should never rely on the state of a different test,
         *  but here it is excepted ;-)
         */
        WebViewScreen.switchToContext(CONTEXT_REF.NATIVE);
    });

    it('should be able to switch between webview, native and webview', ()=> {
        // To be able to use the site in the webview webdriver.io first needs
        // change the context from native to webview
        WebViewScreen.switchToContext(CONTEXT_REF.WEBVIEW);
        browser.click('=API');
        browser.waitForVisible('.navbar-toggle');

        // Now open the swipe screen and do some action there
        // This can only be done if webdriver.io is told to go to the native context
        WebViewScreen.switchToContext(CONTEXT_REF.NATIVE);
        TabBar.openSwipe();
        SwipeScreen.waitForIsShown();
        expect(SwipeScreen.carousel.verifyNthCardContainsText('first', 'Fully Open Source'));

        SwipeScreen.carousel.swipeLeft();
        expect(SwipeScreen.carousel.verifyNthCardContainsText('active', 'Creat community'));

        // Now go back to the webview and open the click actions
        TabBar.openWebView();
        // To be able to use the site in the webview webdriver.io first needs
        // change the context from native to webview
        WebViewScreen.switchToContext(CONTEXT_REF.WEBVIEW);
        // And open the `click` action
        browser.click('.navbar-toggle');
        browser.waitForVisible('=click');
        browser.click('=click');
        browser.waitForVisible('h1#click');
        expect(browser.getText('h1#click')).toEqual('CLICK');
    });
});
