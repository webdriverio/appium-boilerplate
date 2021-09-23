import TabBar from '../screenobjects/components/TabBar';
import WebViewScreen from '../screenobjects/WebviewScreen';
import SwipeScreen from '../screenobjects/SwipeScreen';
import { CONTEXT_REF } from '../helpers/WebView';
import Carousel from '../screenobjects/components/Carousel';

describe('WebdriverIO and Appium, when interacting with a WebView,', () =>  {
    beforeEach(async () =>  {
        // Wait for the tab bar to be show
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

    it('should be able search for the url method and open it', async () =>  {
        // To be able to use the site in the webview webdriver.io we first need to
        // change the context from native to webview
        await WebViewScreen.switchToContext(CONTEXT_REF.WEBVIEW);
        // Now the site can be accessed like you would automate a normal website
        // keep in mind the responsiveness

        // Open the search options
        await $('.DocSearch').click();
        // Search for url
        await $('.DocSearch-Input').setValue('url');
        // There might be a history, so make sure the first result is in the `browser` category
        await driver.waitUntil(async ()=>
            await (await $$('.DocSearch-Hit-source'))[0].getText() === 'browser'
        );
        // Let's take the first result
        await $('#docsearch-item-0 a').click();

        // Now wait for the header to be displayed and verify that we are on the correct page
        await $('h1').waitForDisplayed({ timeout: 3000 });
        await expect(await driver.getTitle()).toEqual('url | WebdriverIO');

        /**
         * IMPORTANT!!
         *  Because the app is not closed and opened between the 2 tests
         *  (and thus is NOT starting in the default context which is native)
         *  the context is here set to native. This is bad practice,
         *  because you should never rely on the state of a different test,
         *  but here it is excepted ;-)
         */
        await WebViewScreen.switchToContext(CONTEXT_REF.NATIVE);
    });

    it.only('should be able to switch between webview, native and webview', async () =>  {
        // To be able to use the site in the webview webdriver.io first needs
        // change the context from native to webview
        await WebViewScreen.switchToContext(CONTEXT_REF.WEBVIEW);
        // Open the search options
        await $('.DocSearch').click();
        // Wait for the search box to be there
        // We don't put an expect here because the wait for will fail if the element is not there.
        // This means this is already an "indirect" expectation
        await $('.DocSearch-Input').waitForDisplayed();
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
            await $('.DocSearch-Footer').click();
        }
        // Now open the swipe screen and do some action there
        // This can only be done if webdriver.io is told to go to the native context
        await WebViewScreen.switchToContext(CONTEXT_REF.NATIVE);
        await TabBar.openSwipe();
        await SwipeScreen.waitForIsShown();
        await expect(await Carousel.getNthCardText('first')).toContain('FULLY OPEN SOURCE');

        await Carousel.swipeLeft();
        await expect(await Carousel.getNthCardText('active')).toContain('GREAT COMMUNITY');

        // Now go back to the webview. It will automatically open in the previous state
        await TabBar.openWebView();
        // To be able to use the site in the webview webdriver.io first needs
        // change the context from native to webview
        await WebViewScreen.switchToContext(CONTEXT_REF.WEBVIEW);
        // Search for the OCR service
        await $('.DocSearch-Input').setValue('ocr service for appium native apps');
        // There might be a history, so make sure the first result is in the `Services` category
        await driver.waitUntil(async ()=>
            await (await $$('.DocSearch-Hit-source'))[0].getText() === 'Services'
        );
        // Let's take the first result
        await $('#docsearch-item-0 a').click();

        // Now wait for the header to be displayed and verify that we are on the correct page
        await $('h1').waitForDisplayed({ timeout: 3000 });
        await expect(await driver.getTitle()).toEqual('OCR service for Appium Native Apps Service | WebdriverIO');
    });
});
