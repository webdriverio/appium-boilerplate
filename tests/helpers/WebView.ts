export const CONTEXT_REF = {
    NATIVE: 'native',
    WEBVIEW: 'webview',
};
const DOCUMENT_READY_STATE = {
    COMPLETE: 'complete',
    INTERACTIVE: 'interactive',
    LOADING: 'loading',
};

class WebView {
    /**
     * Wait for the webview context to be loaded
     *
     * By default you have `NATIVE_APP` as the current context. If a webview is loaded it will be
     * added to the current contexts and will looks something like this for iOS
     * `["NATIVE_APP","WEBVIEW_28158.2"]`
     * The number behind `WEBVIEW` will be a random number in random order.
     *
     * For Android you can get something like
     * ["NATIVE_APP","WEBVIEW_com.wdiodemoapp", "WEBVIEW_com.chrome"]`.
     * The string behind `WEBVIEW` will the package name of the app that holds
     * the webview
     */
    async waitForWebViewContextLoaded () {
        await driver.waitUntil(
            async () => {
                const currentContexts = await this.getCurrentContexts();

                return currentContexts.length > 1 &&
                    currentContexts.find(context => context.toLowerCase().includes(CONTEXT_REF.WEBVIEW)) !== 'undefined';
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
     * Switch to native or webview context
     */
    async switchToContext (context:string) {
        // The first context will always be the NATIVE_APP,
        // the second one will always be the WebdriverIO web page
        await driver.switchContext((await this.getCurrentContexts())[context === CONTEXT_REF.NATIVE ? 0 : 1]);
    }

    /**
     * Returns an object with the list of all available contexts
     */
    async getCurrentContexts ():Promise<string[]> {
        return driver.getContexts();
    }

    /**
     * Wait for the document to be fully loaded
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
        await this.waitForWebViewContextLoaded();
        await this.switchToContext(CONTEXT_REF.WEBVIEW);
        await this.waitForDocumentFullyLoaded();
        await this.switchToContext(CONTEXT_REF.NATIVE);
    }
}

export default WebView;
