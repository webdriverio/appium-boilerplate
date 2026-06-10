import TabBar from "../screenobjects/components/TabBar.js";
import WebViewScreen from "../screenobjects/WebviewScreen.js";
import SwipeScreen from "../screenobjects/SwipeScreen.js";
import { CONTEXT_REF } from "../helpers/WebView.js";

describe("WebdriverIO and Appium, when interacting with a WebView,", () => {
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

    it("should be able search for the url method and open it", async () => {
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

        // Open the search options
        await $(".DocSearch").click();
        // Search for url
        await $(".DocSearch-Input").setValue("url");
        await driver.waitUntil(
            async () => (await $(".DocSearch-HitsFooter").getText()).includes("See all"),
            { timeout: 10000, interval: 500, timeoutMsg: 'Search results footer "See all" not shown within 10s' },
        );
        // Let's take the first result
        await $("#docsearch-hits0-item-0 a").click();

        // Now wait for the header to be displayed and verify that we are on the correct page
        await $("h1").waitForDisplayed({ timeout: 3000, timeoutMsg: 'Page heading h1 not shown within 3s' });
        await expect(await driver.getTitle()).toEqual("url | WebdriverIO");

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

    it("should be able to switch between webview, native and webview", async () => {
        // To be able to use the site in the webview of the app we first need to
        // change the context from native to webview
        await driver.switchContext({
            // We switch to the webview context by using more detailed information
            // We check with a regex on the title and the url
            title: /WebdriverIO.*/,
            url: 'https://webdriver.io/',
        });
        // Open the search options
        await $(".DocSearch").click();
        // Wait for the search box to be there
        // We don't put an expect here because the wait for will fail if the element is not there.
        // This means this is already an "indirect" expectation
        await $(".DocSearch-Input").waitForDisplayed({ timeoutMsg: 'DocSearch input not shown within timeout' });
        // Wait for keyboard animation to settle; ignore timeout if keyboard never appears
        await driver.waitUntil(async () => await driver.isKeyboardShown(), {
            timeout: 5000,
            interval: 500,
            timeoutMsg: 'keyboard settle wait',
        }).catch(() => {});
        // Hide the keyboard if shown
        if (await driver.isKeyboardShown()) {
            /**
             * Normally we would hide the keyboard with this command `driver.hideKeyboard()`, but there is an issue for hiding the keyboard
             * on iOS when using the command. You will get an error like below
             *
             *  Request failed with status 400 due to Error Domain=com.facebook.WebDriverAgent Code=1 "The keyboard on iPhone cannot be
             *  dismissed because of a known XCTest issue. Try to dismiss it in the way supported by your application under test."
             *  UserInfo={NSLocalizedDescription=The keyboard on iPhone cannot be dismissed because of a known XCTest issue. Try to dismiss
             *  it in the way supported by your application under test.}
             *
             * That's why we click on the footer
             */
            await $(".DocSearch-Footer").click();
        }

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
        // Search for the Appium service page
        await $(".DocSearch-Input").setValue(
            "appium service"
        );
        await driver.waitUntil(
            async () => (await $(".DocSearch-HitsFooter").getText()).includes("See all"),
            { timeout: 10000, interval: 500, timeoutMsg: 'Search results footer "See all" not shown within 10s' },
        );
        // Let's take the first result
        await $("#docsearch-hits0-item-0 a").click();

        // Now wait for the header to be displayed and verify that we are on the correct page
        await $("header h1").waitForDisplayed({ timeout: 10000, timeoutMsg: 'WebView page header not displayed after navigation' });
        await expect(await $("header h1").getText()).toContain("Appium Service");
    });
});
