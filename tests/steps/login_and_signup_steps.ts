import {Given, When, Then} from '@wdio/cucumber-framework'
import TabBar from '../screenobjects/components/TabBar.js';
import LoginScreen from '../screenobjects/LoginScreen.js';
import NativeAlert from '../screenobjects/components/NativeAlert.js';

Given(/^I am on the (login|signup) tab$/, async (tab) => {
    await TabBar.waitForTabBarShown();
    await TabBar.openLogin();
    await LoginScreen.waitForIsShown(true);
});

When(/^I enter valid (login|signup) credentials$/, async (formType) => {
    if (formType === 'login') {
        await LoginScreen.tapOnLoginContainerButton();
        await LoginScreen.submitLoginForm({username: 'test@webdriver.io', password: 'Test1234!'});
    } else if (formType === 'signup') {
        await LoginScreen.tapOnSignUpContainerButton();
        await LoginScreen.submitSignUpForm({username: 'test@webdriver.io', password: 'Test1234!'});
    }
});

Then(/^I should see a (Success|Signed Up) alert$/, async (alertType) => {
    await NativeAlert.waitForIsShown();
    await expect(await NativeAlert.text()).toContain(alertType);
});

Then('the alert should be closed when I click on OK', async () => {
    await NativeAlert.topOnButtonWithText('OK');
    await NativeAlert.waitForIsShown(false);
});
