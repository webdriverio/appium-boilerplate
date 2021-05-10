export default class TabBar {
    static openHome ():void {
        $('~Home').click();
    }

    static openWebView ():void {
        $('~Webview').click();
    }

    static openLogin ():void {
        $('~Login').click();
    }

    static openForms ():void {
        $('~Forms').click();
    }

    static openSwipe ():void {
        $('~Swipe').click();
    }

    static openDrag ():void {
        $('~Drag').click();
    }

    static waitForTabBarShown ():boolean|void {
        return $('~Home').waitForDisplayed({
            timeout: 20000,
        });
    }
}
