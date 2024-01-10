import { BUNDLE_ID } from './Constants.js';

export const CONTEXT_REF = {
    NATIVE_APP: 'NATIVE_APP',
    WEBVIEW: 'WEBVIEW',
} as const;
const DOCUMENT_READY_STATE = {
    COMPLETE: 'complete',
    INTERACTIVE: 'interactive',
    LOADING: 'loading',
};

type ContextType = typeof CONTEXT_REF[keyof typeof CONTEXT_REF];
type AndroidInternalContexts = Array<{
    proc: string;
    webview: string;
    info: {
        'Android-Package': string;
        Browser: string;
        'Protocol-Version': string;
        'User-Agent': string;
        'V8-Version': string;
        'WebKit-Version': string;
        webSocketDebuggerUrl: string;
    };
    pages?: [{
        description: string;
        devtoolsFrontendUrl: string;
        faviconUrl: string;
        id: string;
        title: string;
        type: string;
        url: string;
        webSocketDebuggerUrl: string;
    }];
    webviewName: string;
}>;
type ContextInterface = {
    id: string;
    title?: string;
    url?: string;
}
type IosContext  = {
    bundleId?: string;
}
type IosContexts = (ContextInterface & IosContext)[];
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
type AndroidContexts = (ContextInterface & AndroidContext)[];
type CrossPlatformContexts = IosContexts | AndroidContexts;

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
                const currentContexts = await this.getCurrentContexts();
                // The name of the webview can be different on Android and iOS, so we need to check for both
                // We can get the app identifier for Android with the `driver.getCurrentPackage()` command, but there is no equivalent for iOS
                const appIdentifier = driver.isIOS ? BUNDLE_ID : await driver.getCurrentPackage();

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
     * Custom implementation to switch to a webview for Android and iOS
     */
    async switchToContext({ context, title, url }: { context: ContextType, title?: string, url?: string }) {
        if (context === CONTEXT_REF.NATIVE_APP) {
            return driver.switchContext(CONTEXT_REF.NATIVE_APP);
        }

        // Title and url are optional, but if they are provided we can use them to find the correct webview.
        // We can't only rely on the context name due to the fact that we can have multiple webviews which
        // could have different titles/urls
        if (!title && !url) {
            console.warn('\nTo get the best result, provide a title and, or url which will be used to find the correct webview. The more information the bigger the chance it will find the correct webview.\n');
        }

        // Get the contexts with our custom method
        const currentContexts = await this.getCurrentContexts();

        let matchingContext;
        let packageName;

        // This is where the magic happens, we are going to find the correct context(pae) to switch to for iOS or Android.
        if (driver.isIOS) {
            matchingContext = this.findMatchingContext({ contexts: currentContexts, identifier: BUNDLE_ID, title, url });
        } else {
            packageName = await driver.getCurrentPackage();
            // 1. To find the correct webview page for Android we need to switch to the webview first
            const webviewName = `WEBVIEW_${packageName}`;
            await driver.switchContext(webviewName);
            // 2. Now we need to find the correct page inside the webview
            matchingContext = this.findMatchingContext({ contexts: currentContexts, identifier: packageName, title, url });
        }

        if (!matchingContext) {
            throw new Error(this.generateNonMatchingErrorMessage({
                identifier: driver.isIOS ? BUNDLE_ID :
                packageName as string,
                title,
                url,
            }));
        }

        // For iOS we can just use the `driver.switchContext` method to switch to the webview,
        // but for Android we are already in the webview. We now need to switch to the correct page inside the webview
        const switchFunction = driver.isIOS ? driver.switchContext.bind(driver) : driver.switchToWindow.bind(driver);
        // Now switch to the correct context
        return switchFunction(matchingContext.id);
    }

    /**
     * Find a matching context.
     *
     * NOTE: This is an internal method and should not be called outside of this class
     */
    private findMatchingContext({ contexts, identifier, title, url }:{contexts: CrossPlatformContexts; identifier: string; title?: string; url?: string; }) {
        return contexts.find(context => {
            const idMatch = driver.isIOS ? (context as IosContext).bundleId === identifier : (context as AndroidContext).packageName === identifier;
            const titleMatches = title ? context.title?.includes(title) : true;
            const urlMatches = url ? context.url?.includes(url) : true;
            const additionalChecks = driver.isIOS ? true : (context as AndroidContext).androidWebviewData?.attached && (context as AndroidContext).androidWebviewData?.visible;

            return idMatch && titleMatches && urlMatches && additionalChecks;
        });
    }

    /**
     * Generate an error message for when the identifier matches, but the title or url do not match
     *
     * NOTE: This is an internal method and should not be called outside of this class
     */
    private generateNonMatchingErrorMessage({ identifier, title, url }:{identifier: string, title?: string, url?: string}): string {
        let errorMessage = `The ${identifier} matches, but the provided `;
        if (title && url) {
            errorMessage += `title (${title}) or URL (${url}) do not match any context.`;
        } else if (title) {
            errorMessage += `title (${title}) does not match any context.`;
        } else if (url) {
            errorMessage += `URL (${url}) does not match any context.`;
        } else {
            errorMessage = `The identifier (${identifier}) matches, but no matching context is found.`;
        }
        return errorMessage;
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
        await this.switchToContext({ context: CONTEXT_REF.WEBVIEW, title: 'WebdriverIO', url: 'webdriver.io' });
        await this.waitForDocumentFullyLoaded();
        await this.switchToContext({ context: CONTEXT_REF.NATIVE_APP });
    }

    /**
    * Get the current contexts.
    * Instead of using the method `driver.getContexts` we are going to use our
    * own implementation to get back more data
    */
    async getCurrentContexts(elapsedTime: number = 0): Promise<CrossPlatformContexts> {
        // We will use the `driver.execute('mobile: getContexts')` method to get back the context data,
        // this will make it easier to determine which webview/page inside a webview we need to use
        // - Android: https://github.com/appium/appium-uiautomator2-driver#mobile-getcontexts
        // - iOS: https://appium.github.io/appium-xcuitest-driver/5.12/reference/commands/appium-xcuitest-driver/#mobile-getcontexts
        const contexts = await driver.execute('mobile: getContexts') as IosContexts | AndroidInternalContexts;

        // The logic for iOS is clear, we can just return the contexts which will be an array of objects with more data (see the type) instead of only strings
        if (driver.isIOS) {
            return contexts as IosContexts;
        }

        // For Android we need to wait for the webview to contain pages, so we need to do a few checks
        // 1. Get the package name of the app we are testing
        const packageName = await driver.getCurrentPackage();
        // 2. Parse the Android context data in a more readable format
        const parsedAndroidContexts = await this.parsedAndroidContexts(contexts as AndroidInternalContexts, packageName);
        // 3. Check if there is a webview that belongs to the app we are testing
        const androidContext = parsedAndroidContexts.find((context) => context.packageName === packageName);
        // 4. There are cases that no packageName is returned, so we need to check for that
        const isPackageNameMissing = !androidContext?.packageName;
        // 5. There are also cases that the androidWebviewData is not returned, so we need to check for that
        const isAndroidWebviewDataMissing = androidContext && !('androidWebviewData' in androidContext);
        // 6. There are also cases that the androidWebviewData is returned, but the empty property is not returned, so we need to check for that
        const isAndroidWebviewDataEmpty = androidContext && androidContext.androidWebviewData?.empty;

        if (isPackageNameMissing || isAndroidWebviewDataMissing || isAndroidWebviewDataEmpty) {
            // 6. We will check for 15 seconds, with an interval of 100 ms, if the webview contains the correct data
            if (elapsedTime < 15 * 1000) {
                return new Promise(resolve =>
                    setTimeout(() => resolve(this.getCurrentContexts(elapsedTime + 100)), 100)
                );
            }

            // We didn't find the correct webview, so we will throw an error
            throw new Error(`The packageName '${packageName}' matches, but no webview with pages was loaded in this response: '${JSON.stringify(contexts)}'`);
        }

        // If we are here, we know that the webview is loaded and we can return the parsedAndroidContexts data
        return parsedAndroidContexts;
    }

    /**
    * Parse the Android array and return the same object as iOS
    *
    * Android will return something like this
    * [
    *   {
    *     "proc": "@webview_devtools_remote_29051",
    *     "webview": "WEBVIEW_29051",
    *     "info": {
    *       "Android-Package": "com.wdiodemoapp",
    *       "Browser": "Chrome/113.0.5672.136",
    *       "Protocol-Version": "1.3",
    *       "User-Agent": "Mozilla/5.0 (Linux; Android 14; sdk_gphone64_arm64 Build/UE1A.230829.036; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/113.0.5672.136 Mobile Safari/537.36",
    *       "V8-Version": "11.3.244.11",
    *       "WebKit-Version": "537.36 (@2d54072eb2f350d37f3f304c4ba0fafcddbd7e82)",
    *       "webSocketDebuggerUrl": "ws://127.0.0.1:10900/devtools/browser"
    *     },
    *     "pages": [
    *       {
    *         "description": "{\"attached\":true,\"empty\":false,\"height\":2682,\"never_attached\":false,\"screenX\":0,\"screenY\":144,\"visible\":true,\"width\":1440}",
    *         "devtoolsFrontendUrl": "https://chrome-devtools-frontend.appspot.com/serve_internal_file/@2d54072eb2f350d37f3f304c4ba0fafcddbd7e82/inspector.html?ws=127.0.0.1:10900/devtools/page/6751C1E052A63B0CA27F839216AEF4B8",
    *         "faviconUrl": "https://webdriver.io/img/favicon.png",
    *         "id": "6751C1E052A63B0CA27F839216AEF4B8",
    *         "title": "WebdriverIO · Next-gen browser and mobile automation test framework for Node.js | WebdriverIO",
    *         "type": "page",
    *         "url": "https://webdriver.io/",
    *         "webSocketDebuggerUrl": "ws://127.0.0.1:10900/devtools/page/6751C1E052A63B0CA27F839216AEF4B8"
    *       },
    *       {
    *         "description": "",
    *         "devtoolsFrontendUrl": "https://chrome-devtools-frontend.appspot.com/serve_internal_file/@2d54072eb2f350d37f3f304c4ba0fafcddbd7e82/worker_app.html?ws=127.0.0.1:10900/devtools/page/BB0EE977F0C88F5DF6E50F902A855CDC",
    *         "id": "BB0EE977F0C88F5DF6E50F902A855CDC",
    *         "title": "Service Worker https://webdriver.io/sw.js?params=%7B%22offlineMode%22%3Afalse%2C%22debug%22%3Afalse%7D",
    *         "type": "service_worker",
    *         "url": "https://webdriver.io/sw.js?params=%7B%22offlineMode%22%3Afalse%2C%22debug%22%3Afalse%7D",
    *         "webSocketDebuggerUrl": "ws://127.0.0.1:10900/devtools/page/BB0EE977F0C88F5DF6E50F902A855CDC"
    *       }
    *     ],
    *     "webviewName": "WEBVIEW_com.wdiodemoapp"
    *   }
    * ]
    *
    * This is what the description data means
    * - `attached`:
    *   This indicates whether the web page is currently attached to a web view. A value of true means the page is
    *   attached and likely active, whereas false indicates it is not.
    * - `empty`:
    *   This property shows whether the web page is empty or not. An empty page typically means that there is no
    *   significant content loaded in it. true indicates the page is empty, and false indicates it has content.
    * - `never_attached`:
    *   This signifies whether the page has never been attached to a web view. If true, the page has never been
    *   attached, which could indicate a new or unused page. If false, the page has been attached at some point.
    * - `screenX and screenY`:
    *   These properties give the X and Y coordinates of the web page on the screen, respectively. They indicate
    *   the position of the top-left corner of the web page relative to the screen.
    * - `visible`:
    *   This denotes whether the web page is visible on the screen. true means the page is visible to the user,
    *   and false means it is not.
    * - `width and height`:
    *   These properties specify the dimensions of the web page in pixels. width is the width of the page, and
    *   height is its height.
    * - `faviconUrl` (if present):
    *   This is the URL of the favicon (the small icon associated with the page, often displayed in browser tabs).
    */
    async parsedAndroidContexts(contexts: AndroidInternalContexts, packageName:string): Promise<AndroidContexts> {
        // Android can give back multiple apps that support WebViews, so an array of WebView apps.
        // We want to get the webview of the current app, so we need to have the package name of the app, we can then
        // search for it and filter all other apps out.
        const currentWebviewName = `WEBVIEW_${packageName}`;

        const currentContext = contexts
            .find((webview) => webview.webviewName === currentWebviewName);

        let result = [{ id: 'NATIVE_APP' }];

        if (!currentContext || !currentContext.pages) {
            return result;
        }

        const activePages = currentContext.pages
            .filter((page) => {
                if (page.type === 'page' && page.description) {
                    let descriptionObj;
                    try {
                        descriptionObj = JSON.parse(page.description);
                    } catch (e) {
                        console.error('Failed to parse description:', page.description);
                        return false;
                    }

                    return descriptionObj.attached === true && descriptionObj.visible === true;
                }
                return false;
            })
            // Reconstruct the data so it will be "equal" to iOS WebView object.
            .map((page) => {
                const { attached, empty, never_attached: neverAttached, visible } = JSON.parse(page.description);

                return {
                    id: page.id,
                    title: page.title,
                    url: page.url,
                    packageName,
                    webviewName: currentWebviewName,
                    androidWebviewData:{
                        attached,
                        empty,
                        neverAttached,
                        visible,
                    }
                };
            });

        // Append any active pages to the result array.
        result = result.concat(activePages);

        return result;
    }
}

export default WebView;
