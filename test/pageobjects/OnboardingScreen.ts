import AppScreen from './AppScreen';

const SELECTORS = {
    LOGIN_BTN: browser.isAndroid
        ? 'android=new UiSelector().text("LOG IN").className("android.widget.Button")'
        : `ios predicate string:`,
    START_BTN: browser.isAndroid
        ? 'android=new UiSelector().text("COMEÇAR").className("android.widget.Button")'
        : `ios predicate string:`,
};

class OnboardingScreen extends AppScreen {
    constructor () {
        super('android=new UiSelector().text("LOG IN").className("android.widget.Button")');
    }   

    private get loginButton () {return $(SELECTORS.LOGIN_BTN);}
    private get startButton () {return $('~');}

    async isLoginButtonDisplayed () {
        return this.loginButton.isDisplayed();
    }

    async isStartButtonDisplayed () {
        return this.startButton.isDisplayed();
    }

    async tapOnLoginButton () {
        return this.loginButton.click();
    }

    async tapOnStartButton () {
        return this.startButton.click();
    }
}

export default new OnboardingScreen();
