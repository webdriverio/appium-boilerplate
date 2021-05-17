import TabBar from '../screenobjects/components/TabBar';
import LoginScreen from '../screenobjects/LoginScreen';
import NativeAlert from '../screenobjects/components/NativeAlert';

describe('WebdriverIO and Appium, when interacting with a login form,', () => {
    beforeEach(() => {
        TabBar.waitForTabBarShown();
        TabBar.openLogin();
        LoginScreen.waitForIsShown(true);
    });

    it('should be able login successfully', () => {
        // Always make sure you are on the right tab
        LoginScreen.loginContainerButton.click();
        // Submit the data
        LoginScreen.submitLoginForm({ username: 'test@webdriver.io', password: 'Test1234!' });
        // Wait for the alert and validate it
        NativeAlert.waitForIsShown();
        expect(NativeAlert.text()).toEqual('Success\nYou are logged in!');

        // Close the alert
        NativeAlert.pressButton('OK');
        NativeAlert.waitForIsShown(false);
    });

    it('should be able sign up successfully', () => {
        // Always make sure you are on the right tab
        LoginScreen.signUpContainerButton.click();
        // Submit the data
        LoginScreen.submitSignUpForm({ username: 'test@webdriver.io', password: 'Test1234!' });
        // Wait for the alert and validate it
        NativeAlert.waitForIsShown();
        expect(NativeAlert.text()).toEqual('Signed Up!\nYou successfully signed up!');

        // Close the alert
        NativeAlert.pressButton('OK');
        NativeAlert.waitForIsShown(false);
    });
});
