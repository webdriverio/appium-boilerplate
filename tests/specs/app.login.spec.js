import TabBar from '../screenobjects/components/tab.bar';
import LoginScreen from '../screenobjects/login.screen';

describe('WebdriverIO and Appium, when interacting with a login form,', () => {
    beforeEach(() => {
        TabBar.waitForTabBarShown(true);
        TabBar.openLogin();
        LoginScreen.waitForIsShown(true);
    });

    it('should be able login successfully', () => {
        LoginScreen.loginContainerButon.click();
        LoginScreen.email.setValue('test@webdriver.io');
        LoginScreen.password.setValue('Test1234!');

        if (driver.isKeyboardShown()) {
            driver.hideKeyboard();
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
