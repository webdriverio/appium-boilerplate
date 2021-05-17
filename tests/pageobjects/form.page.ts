import Page from './page';

class FormPage extends Page {
    /**
     * define elements
     */
    get username ():WebdriverIO.Element { return $('#username'); }
    get password ():WebdriverIO.Element { return $('#password'); }
    get submitButton ():WebdriverIO.Element { return $('#login button[type=submit]'); }
    get flash ():WebdriverIO.Element { return $('#flash'); }

    /**
     * a method to encapsule automation code to interact with the page
     * e.g. to login using username and password
     */
    login ({ username, password }: {username:string; password: string;}) {
        this.username.setValue(username);
        this.password.setValue(password);
        browser.hideKeyboard();
        this.submitButton.click();
    }

    /**
     * define or overwrite page methods
     */
    open():string {
        return super.open('login');
    }
}

export default new FormPage();
