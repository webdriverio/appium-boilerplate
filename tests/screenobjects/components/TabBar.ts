export default class TabBar {
    static async openHome () {
        await $('//*[@name="Home"]').click();
    }

    static async openWebView () {
        await $('//*[@name="Webview"]').click();
    }

    static async openLogin () {
        await $('//*[@name="Login"]').click();
    }

    static async openForms () {
        await $('//*[@name="Forms"]').click();
    }

    static async openSwipe () {
        await $('//*[@name="Swipe"]').click();
    }

    static async openDrag () {
        await $('//*[@name="Drag"]').click();
    }

    static async waitForTabBarShown ():Promise<boolean|void> {
        return $('//*[@name="Home"]').waitForDisplayed({
            timeout: 20000,
        });
    }
}
