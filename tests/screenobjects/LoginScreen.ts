import AppScreen from './AppScreen';
import NativeAlert from './components/NativeAlert';

const SELECTORS = {
    LOGIN_SCREEN: '~Login-screen',
    LOGIN_CONTAINER_BUTTON: '~button-login-container',
    SIGN_UP_CONTAINER_BUTTON: '~button-sign-up-container',
    LOGIN_BUTTON: '~button-LOGIN',
    SIGN_UP_BUTTON: '~button-SIGN UP',
    INPUT: '~input-email',
    PASSWORD: '~input-password',
    REPEAT_PASSWORD: '~input-repeat-password'
};

class LoginScreen extends AppScreen {
    constructor () {
        super(SELECTORS.LOGIN_SCREEN);
    }

    get loginContainerButton ():WebdriverIO.Element {
        return $(SELECTORS.LOGIN_CONTAINER_BUTTON);
    }

    get signUpContainerButon ():WebdriverIO.Element {
        return $(SELECTORS.SIGN_UP_CONTAINER_BUTTON);
    }

    get loginButton ():WebdriverIO.Element {
        return $(SELECTORS.LOGIN_BUTTON);
    }

    get signUpButton ():WebdriverIO.Element {
        return $(SELECTORS.SIGN_UP_BUTTON);
    }

    get email ():WebdriverIO.Element {
        return $(SELECTORS.INPUT);
    }

    get password ():WebdriverIO.Element {
        return $(SELECTORS.PASSWORD);
    }

    get repeatPassword ():WebdriverIO.Element {
        return $(SELECTORS.REPEAT_PASSWORD);
    }

    get alert () {
        return NativeAlert;
    }
}

export default new LoginScreen();
