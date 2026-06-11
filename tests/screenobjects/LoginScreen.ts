import AppScreen from './AppScreen.js';

const SELECTORS = {
    SCREEN: '~Login-screen',
    LOGIN_CONTAINER: '~button-login-container',
    SIGN_UP_CONTAINER: '~button-sign-up-container',
    LOGIN_BUTTON: '~button-LOGIN',
    SIGN_UP_BUTTON: '~button-SIGN UP',
    EMAIL: '~input-email',
    PASSWORD: '~input-password',
    REPEAT_PASSWORD: '~input-repeat-password',
    BIOMETRIC_BUTTON: '~button-biometric',
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
    private get signUpContainerButton () {return $(SELECTORS.SIGN_UP_CONTAINER);}
    private get loginButton () {return $(SELECTORS.LOGIN_BUTTON);}
    private get signUpButton () {return $(SELECTORS.SIGN_UP_BUTTON);}
    private get email () {return $(SELECTORS.EMAIL);}
    private get password () {return $(SELECTORS.PASSWORD);}
    private get repeatPassword () {return $(SELECTORS.REPEAT_PASSWORD);}
    private get biometricButton () {return $(SELECTORS.BIOMETRIC_BUTTON);}

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
        await this.hideKeyboardAfterInput();
        await this.loginButton.scrollIntoView();
        await this.loginButton.click();
    }

    async submitSignUpForm({ username, password }:{username:string; password:string;}) {
        await this.email.setValue(username);
        await this.password.setValue(password);
        await this.repeatPassword.setValue(password);
        await this.hideKeyboardAfterInput();
        // iOS 26.x: XCUITest no longer exposes XCUIElementTypeApplication as a scrollable element.
        // Pass an explicit ScrollView so scrollIntoView can resolve the container.
        await this.signUpButton.scrollIntoView({ scrollableElement: this.scrollContainer });
        await this.signUpButton.click();
    }

    private get scrollContainer() {
        return driver.isIOS
            ? $('-ios predicate string:type == "XCUIElementTypeScrollView"')
            : $('android=new UiScrollable(new UiSelector().scrollable(true))');
    }

    // hideKeyboard() throws on iOS — BaseScreen.dismissKeyboard() falls back to tapping the element.
    private async hideKeyboardAfterInput(): Promise<void> {
        await this.dismissKeyboard(this.loginContainerButton);
    }
}

export default new LoginScreen();
