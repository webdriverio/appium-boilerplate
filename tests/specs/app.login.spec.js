import TabBar from '../screenobjects/components/tab.bar';
import LoginScreen from '../screenobjects/login.screen';

describe('Validate the login form', () => {
    beforeEach(() =>{
        TabBar.waitForTabBarShown(true);
    });

    it('should be able login successfully', () => {
        TabBar.openLogin();
        LoginScreen.waitForIsShown(true);
        LoginScreen.loginContainerButon.click();
        LoginScreen.email.setValue('test@webdriver.io');
        LoginScreen.password.setValue('Test1234!');
        if (browser.isKeyboardShown()) {
            browser.hideDeviceKeyboard();
        }
        LoginScreen.loginButton.click();
        LoginScreen.alert.waitForIsShown();
        expect(LoginScreen.alert.text()).toEqual('Success\nYou are logged in!');
        LoginScreen.alert.pressButton('Ok');
        LoginScreen.alert.waitForIsShown(false);
    });

    // Try to implement this yourself
    xit('should be able sign up successfully', () => {

    });
});
