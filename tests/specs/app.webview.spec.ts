import TabBar from '../screenobjects/components/TabBar.js';
import WebViewScreen from '../screenobjects/WebviewScreen.js';
import SwipeScreen from '../screenobjects/SwipeScreen.js';
import { CONTEXT_REF } from '../helpers/WebView.js';

describe('WebdriverIO and Appium, when interacting with a WebView,', () => {
    // For now we exclude this suite for iOS. There is an issue with the current EXPO app
    // which lead to a new feature request for WebdriverIO. We first need to implement that
    // before we can run this test on iOS.
    // BUT!!!: This is only for this new WebdriverIO app, not for the old one or your app.
    // So please take a look at this code to see how you could use WebViews and context switching
    // for your app.
    //
    // The guard must live inside a before hook — driver.isAndroid is not available at module
    // evaluation time (before the WDIO session is created).
    before(function () {
        if (!driver.isAndroid) {
            this.skip();
        }
    });

    beforeEach(async () => {
        // Wait for the tab bar to be shown
        await TabBar.waitForTabBarShown();
        // Open the webview page
        await TabBar.openWebView();
        // This is where a lot of magic is happening
        // - it waits for the webview context to be loaded
        // - it will then switch to the webview and check if the website is
        //   fully loaded
        // - it will then return back to the native context
        await WebViewScreen.waitForWebsiteLoaded();
    });

    it('should be able search for the url method and open it', async () => {
        // To be able to use the site in the webview of the app we first need to
        // change the context from native to webview
        await driver.switchContext({
            // We switch to the webview context by using more detailed information
            // We check with a regex on the title and the url
            title: /WebdriverIO.*/,
            url: 'https://webdriver.io/',
        });
        // Now the site can be accessed like you would automate a normal website
        // keep in mind the responsiveness
        await WebViewScreen.openDocSearch();
        await WebViewScreen.setDocSearchQuery('url');
        await WebViewScreen.waitForSearchResults();
        await WebViewScreen.clickFirstSearchResult();

        // Now wait for the header to be displayed and verify that we are on the correct page
        await WebViewScreen.waitForPageHeading();
        await expect(await driver.getTitle()).toEqual('url | WebdriverIO');

        /**
         * IMPORTANT!!
         *  Because the app is not closed and opened between the 2 tests
         *  (and thus is NOT starting in the default context which is native)
         *  the context is here set to native. This is bad practice,
         *  because you should never rely on the state of a different test,
         *  but here it is excepted ;-)
         */
        await driver.switchContext(CONTEXT_REF.NATIVE_APP);
    });

    it('should be able to switch between webview, native and webview', async () => {
        // To be able to use the site in the webview of the app we first need to
        // change the context from native to webview
        await driver.switchContext({
            // We switch to the webview context by using more detailed information
            // We check with a regex on the title and the url
            title: /WebdriverIO.*/,
            url: 'https://webdriver.io/',
        });
        await WebViewScreen.openDocSearch();
        // waitForDocSearchInput is an indirect assertion — the wait itself fails the test
        // if the element never appears, so no explicit expect() is needed.
        await WebViewScreen.waitForDocSearchInput();
        // Wait for keyboard animation to settle; continue even if it never appears
        await driver.waitUntil(async () => await driver.isKeyboardShown(), {
            timeout: 5000,
            interval: 500,
            timeoutMsg: 'keyboard settle wait',
        }).catch(() => {});
        // Dismiss the keyboard via the footer — hideKeyboard() throws in web context on iOS XCTest.
        await WebViewScreen.dismissDocSearchKeyboard();

        // Now open the swipe screen and do some action there
        // This can only be done if webdriver.io is told to go to the native context
        await driver.switchContext(CONTEXT_REF.NATIVE_APP);
        await TabBar.openSwipe();
        await SwipeScreen.waitForIsShown();

        // Now go back to the webview. It will automatically open in the previous state
        await TabBar.openWebView();
        // To be able to use the site in the webview webdriver.io first needs
        // change the context from native to webview
        await driver.switchContext({
            // We switch to the webview context by using more detailed information
            // We check with a regex on the title and the url
            title: /WebdriverIO.*/,
            url: 'https://webdriver.io/',
        });
        await WebViewScreen.setDocSearchQuery('appium service');
        await WebViewScreen.waitForSearchResults();
        await WebViewScreen.clickFirstSearchResult();

        // Now wait for the header to be displayed and verify that we are on the correct page
        await WebViewScreen.waitForPageHeading();
        await expect(await WebViewScreen.getPageHeadingText()).toContain('Appium Service');
    });
});
