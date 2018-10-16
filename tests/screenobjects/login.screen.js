import AppScreen from './app.screen';
import NativeAlert from '../helpers/NativeAlert';

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

    get loginContainerButon () {
        return $(SELECTORS.LOGIN_CONTAINER_BUTTON);
    }

    get signUpContainerButon () {
        return $(SELECTORS.SIGN_UP_CONTAINER_BUTTON);
    }

    get loginButton () {
        return $(SELECTORS.LOGIN_BUTTON);
    }

    get signUpButton () {
        return $(SELECTORS.SIGN_UP_BUTTON);
    }

    get email () {
        return $(SELECTORS.INPUT);
    }

    get password () {
        return $(SELECTORS.PASSWORD);
    }

    get repeatPassword () {
        return $(SELECTORS.REPEAT_PASSWORD);
    }

    get alert () {
        return NativeAlert;
    }
}

export default new LoginScreen();
