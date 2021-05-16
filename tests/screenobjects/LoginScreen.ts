import AppScreen from './AppScreen';
import NativeAlert from './components/NativeAlert';

class LoginScreen extends AppScreen {
    constructor () {
        super('~Login-screen');
    }

    get loginContainerButton ():WebdriverIO.Element {return $('~button-login-container');}
    get signUpContainerButon ():WebdriverIO.Element {return $('~button-sign-up-container');}
    get loginButton ():WebdriverIO.Element {return $('~button-LOGIN');}
    get signUpButton ():WebdriverIO.Element {return $('~button-SIGN UP');}
    get email ():WebdriverIO.Element {return $('~input-email');}
    get password ():WebdriverIO.Element {return $('~input-password');}
    get repeatPassword ():WebdriverIO.Element {return $('~input-repeat-password');}
    get alert () {return NativeAlert;}
}

export default new LoginScreen();
