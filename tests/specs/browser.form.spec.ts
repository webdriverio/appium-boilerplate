import FormPage from '../pageobjects/form.page';

describe('auth form', () => {
    it('should deny access with wrong creds',  async () => {
        await FormPage.open();
        await FormPage.login({ username:'foo', password: 'bar!' });
        await FormPage.flash.waitForDisplayed({ timeout: 3000 });
        await expect(await FormPage.flash).toHaveTextContaining('Your username is invalid!');
    });

    it('should allow access with correct creds',  async () => {
        await FormPage.open();
        await FormPage.login({ username:'tomsmith', password: 'SuperSecretPassword!' });
        await FormPage.flash.waitForDisplayed({ timeout: 3000 });
        await expect(await FormPage.flash).toHaveTextContaining('You logged into a secure area!');
    });
});
