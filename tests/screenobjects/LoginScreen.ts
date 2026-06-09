import AppScreen from './AppScreen.js';

const SELECTORS = {
    SCREEN: '~Login-screen',
    LOGIN_CONTAINER: '~button-login-container',
};

class LoginScreen extends AppScreen {
    constructor () {
        super(SELECTORS.SCREEN);
    }

    // ~Login-screen is a plain View on iOS 26.x — not in the accessibility tree.
    // Use the interactive login container button instead.
    override async waitForIsShown (isShown = true): Promise<boolean | void> {
        return this.loginContainerButton.waitForDisplayed({
            reverse: !isShown,
            timeoutMsg: `Screen (Login) not ${isShown ? 'shown' : 'hidden'} within timeout`,
        });
    }

    get screen () {return $(SELECTORS.SCREEN);}
    private get loginContainerButton () {return $(SELECTORS.LOGIN_CONTAINER);}
    private get signUpContainerButton () {return $('~button-sign-up-container');}
    private get loginButton () {return $('~button-LOGIN');}
    private get signUpButton () {return $('~button-SIGN UP');}
    private get email () {return $('~input-email');}
    private get password () {return $('~input-password');}
    private get repeatPassword () {return $('~input-repeat-password');}
    private get biometricButton () {return $('~button-biometric');}

    async isBiometricButtonDisplayed () {
        return this.biometricButton.isDisplayed();
    }

    async tapOnLoginContainerButton(){
        await this.loginContainerButton.click();
    }

    async tapOnSignUpContainerButton(){
        await this.signUpContainerButton.click();
    }

    async tapOnBiometricButton(){
        await this.biometricButton.click();
    }

    async submitLoginForm({ username, password }:{username:string; password:string;}) {
        await this.email.setValue(username);
        await this.password.setValue(password);
        await this.dismissKeyboard();
        await this.loginButton.scrollIntoView();
        await this.loginButton.click();
    }

    async submitSignUpForm({ username, password }:{username:string; password:string;}) {
        await this.email.setValue(username);
        await this.password.setValue(password);
        await this.repeatPassword.setValue(password);
        await this.dismissKeyboard();
        await this.signUpButton.scrollIntoView();
        await this.signUpButton.click();
    }

    // hideKeyboard() throws on iOS (XCTest limitation) — fall back to tapping an accessible element.
    private async dismissKeyboard() {
        if (!await driver.isKeyboardShown()) return;
        try {
            await driver.hideKeyboard();
        } catch {
            await this.loginContainerButton.click();
        }
    }
}

export default new LoginScreen();
