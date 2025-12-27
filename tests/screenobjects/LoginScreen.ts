import AppScreen from './AppScreen.js';

const SELECTORS = {
    SCREEN: '//*[@name="Login-screen"]',
};

class LoginScreen extends AppScreen {
    constructor () {
        super(SELECTORS.SCREEN);
    }

    get screen () {return $(SELECTORS.SCREEN);}
    private get loginContainerButton () {return $('//*[@name="button-login-container"]');}
    private get signUpContainerButton () {return $('//*[@name="button-sign-up-container"]');}
    private get loginButton () {return $('//*[@name="button-LOGIN"]');}
    private get signUpButton () {return $('//*[@name="button-SIGN UP"]');}
    private get email () {return $('//*[@name="input-email"]');}
    private get password () {return $('//*[@name="input-password"]');}
    private get repeatPassword () {return $('//*[@name="input-repeat-password"]');}
    private get biometricButton () {return $('//*[@name="button-biometric"]');}

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

        if (await driver.isKeyboardShown()) {
            /**
             * Normally we would hide the keyboard with this command `driver.hideKeyboard()`, but there is an issue for hiding the keyboard
             * on iOS when using the command. You will get an error like below
             *
             *  Request failed with status 400 due to Error Domain=com.facebook.WebDriverAgent Code=1 "The keyboard on iPhone cannot be
             *  dismissed because of a known XCTest issue. Try to dismiss it in the way supported by your application under test."
             *  UserInfo={NSLocalizedDescription=The keyboard on iPhone cannot be dismissed because of a known XCTest issue. Try to dismiss
             *  it in the way supported by your application under test.}
             *
             * That's why we click outside of the keyboard.
             */
            await $('//*[@name="Login-screen"]').click();
        }
        // On smaller screens there could be a possibility that the button is not shown
        // This uses the "new" `scrollIntoView` method that now also supports native apps
        await this.loginButton.scrollIntoView({
            scrollableElement: await this.screen,
        });
        await this.loginButton.click();
    }

    async submitSignUpForm({ username, password }:{username:string; password:string;}) {
        await this.email.setValue(username);
        await this.password.setValue(password);
        await this.repeatPassword.setValue(password);

        if (await driver.isKeyboardShown()) {
            /**
             * Normally we would hide the keyboard with this command `driver.hideKeyboard()`, but there is an issue for hiding the keyboard
             * on iOS when using the command. You will get an error like below
             *
             *  Request failed with status 400 due to Error Domain=com.facebook.WebDriverAgent Code=1 "The keyboard on iPhone cannot be
             *  dismissed because of a known XCTest issue. Try to dismiss it in the way supported by your application under test."
             *  UserInfo={NSLocalizedDescription=The keyboard on iPhone cannot be dismissed because of a known XCTest issue. Try to dismiss
             *  it in the way supported by your application under test.}
             *
             * That's why we click outside of the keyboard.
             */
            await $('//*[@name="Login-screen"]').click();
        }
        // On smaller screens there could be a possibility that the button is not shown
        // This uses the "new" `scrollIntoView` method that now also supports native apps
        await this.signUpButton.scrollIntoView({scrollableElement: await this.screen});
        await this.signUpButton.click();
    }
}

export default new LoginScreen();
