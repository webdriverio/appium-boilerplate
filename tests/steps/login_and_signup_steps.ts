import { Given, When, Then } from '@wdio/cucumber-framework';
import TabBar from '../screenobjects/components/TabBar.js';
import LoginScreen from '../screenobjects/LoginScreen.js';
import NativeAlert from '../screenobjects/components/NativeAlert.js';

Given(/^I am on the (login|signup) tab$/, async (tab: string) => {
    await TabBar.waitForTabBarShown();
    await TabBar.openLogin();
    await LoginScreen.waitForIsShown(true);
    // Navigate to the correct container based on the captured tab name
    if (tab === 'signup') {
        await LoginScreen.tapOnSignUpContainerButton();
    } else {
        await LoginScreen.tapOnLoginContainerButton();
    }
});

When(/^I enter valid (login|signup) credentials$/, async (formType) => {
    if (formType === 'login') {
        // Given already tapped the login container to show the form — do not tap again.
        await LoginScreen.submitLoginForm({ username: 'test@webdriver.io', password: 'Test1234!' });
    } else if (formType === 'signup') {
        // Given already tapped the signup container to show the form — do not tap again.
        await LoginScreen.submitSignUpForm({ username: 'test@webdriver.io', password: 'Test1234!' });
    }
});

Then(/^I should see a (Success|Signed Up) alert$/, async (alertType) => {
    await NativeAlert.waitForIsShown();
    await expect(await NativeAlert.text()).toContain(alertType);
});

Then('the alert should be closed when I click on OK', async () => {
    await NativeAlert.tapOnButtonWithText('OK');
    await NativeAlert.waitForIsShown(false);
});
