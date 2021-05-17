import AppScreen from './AppScreen';
import Gestures from '../helpers/Gestures';

class LoginScreen extends AppScreen {
    constructor () {
        super('~Login-screen');
    }

    get loginContainerButton ():WebdriverIO.Element {return $('~button-login-container');}
    get signUpContainerButton ():WebdriverIO.Element {return $('~button-sign-up-container');}
    get loginButton ():WebdriverIO.Element {return $('~button-LOGIN');}
    get signUpButton ():WebdriverIO.Element {return $('~button-SIGN UP');}
    get email ():WebdriverIO.Element {return $('~input-email');}
    get password ():WebdriverIO.Element {return $('~input-password');}
    get repeatPassword ():WebdriverIO.Element {return $('~input-repeat-password');}
    get biometricButton ():WebdriverIO.Element {return $('~button-biometric');}

    submitLoginForm({ username, password }:{username:string; password:string;}) {
        this.email.setValue(username);
        this.password.setValue(password);

        if (driver.isKeyboardShown()) {
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
            $('~Login-screen').click();
        }
        // On smaller screens there could be a possibility that the button is not shown
        Gestures.checkIfDisplayedWithSwipeUp(this.loginButton, 2);
        this.loginButton.click();
    }

    submitSignUpForm({ username, password }:{username:string; password:string;}) {
        this.email.setValue(username);
        this.password.setValue(password);
        this.repeatPassword.setValue(password);

        if (driver.isKeyboardShown()) {
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
            $('~Login-screen').click();
        }
        // On smaller screens there could be a possibility that the button is not shown
        Gestures.checkIfDisplayedWithSwipeUp(this.signUpButton, 2);
        this.signUpButton.click();
    }
}

export default new LoginScreen();
