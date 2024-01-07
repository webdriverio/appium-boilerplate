import AppScreen from './AppScreen.js';
import Gestures from '../helpers/Gestures.js';

const SELECTORS = {
    SCREEN: '~Login-screen',
};

class LoginScreen extends AppScreen {
    constructor () {
        super(SELECTORS.SCREEN);
    }

    get screen () {return $(SELECTORS.SCREEN);}
    private get loginContainerButton () {return $('~button-login-container');}
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
            await $('~Login-screen').click();
        }
        // On smaller screens there could be a possibility that the button is not shown
        await Gestures.checkIfDisplayedWithSwipe({
            scrollContainer: await this.screen,
            searchableElement: await this.loginButton,
            maxScrolls: 2,
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
            await $('~Login-screen').click();
        }
        // On smaller screens there could be a possibility that the button is not shown
        await Gestures.checkIfDisplayedWithSwipe({
            scrollContainer: await this.screen,
            searchableElement: await this.signUpButton,
            maxScrolls: 2,
        });
        await this.signUpButton.click();
    }
}

export default new LoginScreen();
