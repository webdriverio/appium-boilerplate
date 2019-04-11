import TabBar from '../screenobjects/components/tab.bar';
import WebViewScreen from '../screenobjects/webview.screen';
import SwipeScreen from '../screenobjects/swipe.screen';
import { CONTEXT_REF } from '../helpers/WebView';

describe('WebdriverIO and Appium, when interacting with a WebView,', () => {
    beforeEach(() => {
        TabBar.waitForTabBarShown(true);
        TabBar.openWebView();
        WebViewScreen.waitForWebsiteLoaded();
    });

    it('should be able to open call action on the API page', () => {
        // To be able to use the site in the webview webdriver.io first needs
        // change the context from native to webview
        WebViewScreen.switchToContext(CONTEXT_REF.WEBVIEW);
        // Now the site can be accessed like you would automate a normal website
        // keep in mind the responsiveness
        // Open the API docs
        $('=API').click();
        // And open the `click` action
        const toggle = $('.navToggle');
        toggle.waitForDisplayed(3000);
        toggle.click();

        const webdriverProtocol = $('=Webdriver Protocol');
        webdriverProtocol.waitForDisplayed(3000);
        webdriverProtocol.click();

        const header = $('h1.postHeaderTitle');
        header.waitForDisplayed(3000);
        expect(header.getText()).toEqual('WEBDRIVER PROTOCOL');

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

    it('should be able to switch between webview, native and webview', () => {
        // To be able to use the site in the webview webdriver.io first needs
        // change the context from native to webview
        WebViewScreen.switchToContext(CONTEXT_REF.WEBVIEW);
        $('=API').click();

        const toggle = $('.navToggle');
        toggle.waitForDisplayed(3000);

        // Now open the swipe screen and do some action there
        // This can only be done if webdriver.io is told to go to the native context
        WebViewScreen.switchToContext(CONTEXT_REF.NATIVE);
        TabBar.openSwipe();
        SwipeScreen.waitForIsShown();
        expect(SwipeScreen.carousel.verifyNthCardContainsText('first', 'Fully Open Source'));

        SwipeScreen.carousel.swipeLeft();
        expect(SwipeScreen.carousel.verifyNthCardContainsText('active', 'Creat community'));

        // Now go back to the webview and open the call actions
        TabBar.openWebView();
        // To be able to use the site in the webview webdriver.io first needs
        // change the context from native to webview
        WebViewScreen.switchToContext(CONTEXT_REF.WEBVIEW);
        // And open the `call` action
        toggle.click();

        const webdriverProtocol = $('=Webdriver Protocol');
        webdriverProtocol.waitForDisplayed(3000);
        webdriverProtocol.click();

        const header = $('h1.postHeaderTitle');
        header.waitForDisplayed(3000);
        expect(header.getText()).toEqual('WEBDRIVER PROTOCOL');
    });
});
