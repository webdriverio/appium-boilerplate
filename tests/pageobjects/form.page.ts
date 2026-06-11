import Page from './page.js';

class FormPage extends Page {
    /**
     * define elements
     */
    get username () { return $('#username'); }
    get password () { return $('#password'); }
    get submitButton () { return $('#login button[type=submit]'); }
    get flash () { return $('#flash'); }
    private get pageHeading () { return $('#content h2'); }

    /**
     * a method to encapsule automation code to interact with the page
     * e.g. to login using username and password
     */
    async login ({ username, password }: {username:string; password: string;}) {
        await this.username.setValue(username);
        await this.password.setValue(password);
        // only for mobile, if you test on a desktop browser `hideKeyboard` won't exist.
        if (driver.isMobile) {
            // driver.hideKeyboard() throws on iOS (XCTest limitation) — tap outside to dismiss instead.
            await this.pageHeading.click();
        }
        await this.submitButton.click();
    }

    /**
     * define or overwrite page methods
     */
    async open(): Promise<void> {
        return super.open('login');
    }
}

export default new FormPage();
