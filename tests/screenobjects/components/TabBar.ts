const SELECTORS = {
    HOME: '~Home',
    WEBVIEW: '~Webview',
    LOGIN: '~Login',
    FORMS: '~Forms',
    SWIPE: '~Swipe',
    DRAG: '~Drag',
};

export default class TabBar {
    static async openHome () {
        await $(SELECTORS.HOME).click();
    }

    static async openWebView () {
        await $(SELECTORS.WEBVIEW).click();
    }

    static async openLogin () {
        await $(SELECTORS.LOGIN).click();
    }

    static async openForms () {
        await $(SELECTORS.FORMS).click();
    }

    static async openSwipe () {
        await $(SELECTORS.SWIPE).click();
    }

    static async openDrag () {
        await $(SELECTORS.DRAG).click();
    }

    static async waitForTabBarShown ():Promise<boolean|void> {
        return $(SELECTORS.HOME).waitForDisplayed({
            timeout: 45000,
            timeoutMsg: 'Tab bar was not shown within 45s',
        });
    }
}
