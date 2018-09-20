import TabBar from '../screenobjects/components/tab.bar';
import LoginScreen from '../screenobjects/login.screen';

describe('WebdriverIO and Appium, when interacting with a login form,', () => {
    beforeEach(() =>{
        TabBar.waitForTabBarShown(true);
        TabBar.openLogin();
        LoginScreen.waitForIsShown(true);
    });

    it('should be able login successfully', () => {
        LoginScreen.loginContainerButon.click();
        LoginScreen.email.setValue('test@webdriver.io');
        LoginScreen.password.setValue('Test1234!');

        /**
         * The` browser.isKeyboardShown()` is a custom function that can
         * be found in `./config/wdio.shared.conf.js`
         */
        if (browser.isKeyboardShown()) {
            browser.hideDeviceKeyboard();
        }
        LoginScreen.loginButton.click();
        LoginScreen.alert.waitForIsShown();
        expect(LoginScreen.alert.text()).toEqual('Success\nYou are logged in!');

        LoginScreen.alert.pressButton('OK');
        LoginScreen.alert.waitForIsShown(false);
    });

    // Try to implement this yourself
    xit('should be able sign up successfully', () => {

    });
});
