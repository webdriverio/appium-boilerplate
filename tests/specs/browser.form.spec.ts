import FormPage from '../pageobjects/form.page';

describe('auth form', () => {
    it('should deny access with wrong creds',  () => {
        FormPage.open();
        FormPage.login({ username:'foo', password: 'bar!' });
        FormPage.flash.waitForDisplayed({ timeout: 3000 });
        expect(FormPage.flash).toHaveTextContaining('Your username is invalid!');
    });

    it('should allow access with correct creds',  () => {
        FormPage.open();
        FormPage.login({ username:'tomsmith', password: 'SuperSecretPassword!' });
        FormPage.flash.waitForDisplayed({ timeout: 3000 });
        expect(FormPage.flash).toHaveTextContaining('You logged into a secure area!');
    });
});
