export default class TabBar {
    static openHome () {
        $('~Home').click();
    }

    static openWebView () {
        $('~Webview').click();
    }

    static openLogin () {
        $('~Login').click();
    }

    static openForms () {
        $('~Forms').click();
    }

    static openSwipe () {
        $('~Swipe').click();
    }

    static openDrag () {
        $('~Drag').click();
    }

    static waitForTabBarShown ():boolean|void {
        return $('~Home').waitForDisplayed({
            timeout: 20000,
        });
    }
}
