export const CONTEXT_REF = {
    NATIVE_APP: 'NATIVE_APP',
    WEBVIEW: 'WEBVIEW',
} as const;
const DOCUMENT_READY_STATE = {
    COMPLETE: 'complete',
    INTERACTIVE: 'interactive',
    LOADING: 'loading',
};

type ContextInterface = {
    id: string;
    title?: string;
    url?: string;
}
type IosContext  = {
    bundleId?: string;
}
type AndroidContext =  {
    packageName?: string;
    webviewName?: string;
    androidWebviewData?: {
        attached: boolean;
        empty: boolean;
        neverAttached: boolean;
        visible: boolean;
    }
}

/**
 * There is a huge difference between the Android and iOS implementation for WebViews. We'll start with explaining the iOS implementation.
 *
 * iOS:
 * - an iOS app can have MULTIPLE WebViews for one app, but only one can be active at the same time
 * - when you call the default `driver.getContexts()` method you will get back an array of strings with:
 *      - `NATIVE_APP`
 *      - 0-N Webviews with the name `WEBVIEW-{randomNumber}`
 * - the order will be random, so you can't rely on the order of the array
 * - the default method doesn't give you enough information to determine which webview you need to use,
 *   for example no title or url of the webview
 *
 * Android:
 * - an Android App can only have ONE WebView per app, but it can have multiple pages inside the WebView (in theory you can see them as multiple webviews)
 * - when you call the default `driver.getContexts()` method you will get back an array of strings with:
 *     - `NATIVE_APP`
 *    - `WEBVIEW-{packageName}`, if you have Chrome in the background you will also get back `WEBVIEW_com.android.chrome`
 * - the order will be random, so you can't rely on the order of the array
 * - the default method doesn't give you enough information to determine which webview you need to use,
 *   for example no title or url of the webview
 *
 * The below class will give you custom implementations for both Android and iOS to get the correct webview.
 * Please read the comments in the code for more information.
 */
class WebView {
    /**
     * Wait for the webview context to be added to the contexts
     *
     * NOTE: this will say nothing if the url in the webview is loaded, only that the expected webview is added to the contexts
     *
     * The Webview is always connected to the app we are testing, this means we need to get the app identifier and see if the
     * webview context is added. For Android this will be the `packageName` and for iOS this will be the `bundleId`.
     *
     * By default you have `NATIVE_APP` as the current context. If a webview is added it will be added to the current contexts.
     * We use a custom command to get the current contexts because the official `driver.getContexts()`
     * doesn't return enough valuable information which we later on need to switch to the correct webview.
     *
     * NOTES:
     * - Android: The string behind `WEBVIEW` will the package name of the app that holds the webview
     * - iOS: The number behind `WEBVIEW` will be a random number in random order.
     */
    async waitForWebViewContextAdded () {
        await driver.waitUntil(
            async () => {
                // Check this method for detailed webview context information
                const currentContexts = await driver.getContexts({
                    returnAndroidDescriptionData: true,
                    returnDetailedContexts: true
                });
                // The name of the webview can be different on Android and iOS, so we need to check for both
                const appIdentifier = driver.isIOS ?
                    // @ts-expect-error
                    (await browser.execute('mobile: activeAppInfo'))?.bundleId :
                    await driver.getCurrentPackage()

                return currentContexts.length > 1 &&
                    currentContexts.find(context => {
                        if (driver.isIOS){
                            // Also check if the url is not blank for iOS, meaning nothing is loaded. This is the "first state" for iOS
                            return (context as IosContext).bundleId === appIdentifier && (context as ContextInterface)?.url !== 'about:blank';
                        }

                        // Also check that the matching page is not empty
                        return (context as AndroidContext).packageName === appIdentifier && (context as AndroidContext)?.androidWebviewData?.empty === false;
                    });
            }, {
                // Wait a max of 45 seconds. Reason for this high amount is that loading
                // a webview for iOS might take longer
                timeout: 45000,
                timeoutMsg: 'Webview context not loaded',
                interval: 100,
            },
        );
    }

    /**
     * Selenium or Appium normally automatically wait for a page to be loaded, but this doesn't work for webviews.
     * This method can be called when you have switched to a webview and you want to be sure for the page to be fully loaded.
     */
    async waitForDocumentFullyLoaded () {
        await driver.waitUntil(
            // A webpage can have multiple states, the ready state is the one we need to have.
            // This looks like the same implementation as for the w3c implementation for `browser.url('https://webdriver.io')`
            // That command also waits for the readiness of the page, see also the w3c specs
            // https://www.w3.org/TR/webdriver/#dfn-waiting-for-the-navigation-to-complete
            async() => (await driver.execute(() => document.readyState)) === DOCUMENT_READY_STATE.COMPLETE,
            {
                timeout: 15000,
                timeoutMsg: 'Website not loaded',
                interval: 100,
            },
        );
    }

    /**
     * Wait for the website in the webview to be loaded
     */
    async waitForWebsiteLoaded () {
        await this.waitForWebViewContextAdded();
        // we know we want to switch to the webview of WebdriverIO, so we can already provide the title and url that expect to find.
        // This will make the search more accurate
        await driver.switchContext({
            title: /WebdriverIO.*/,
            url: 'https://webdriver.io/',
        });
        await this.waitForDocumentFullyLoaded();
        await driver.switchContext(CONTEXT_REF.NATIVE_APP);
    }
}

export default WebView;
