import FormPage from '../pageobjects/form.page.js';

describe('auth form', () => {
    it('should deny access with wrong credentials',  async () => {
        await FormPage.open();
        await FormPage.login({ username:'foo', password: 'bar!' });
        await FormPage.flash.waitForDisplayed({ timeout: 3000 });
        await expect(await FormPage.flash).toHaveText(
            expect.stringContaining('Your username is invalid!'));
    });

    it('should allow access with correct credentials',  async () => {
        await FormPage.open();
        await FormPage.login({ username:'tomsmith', password: 'SuperSecretPassword!' });
        await FormPage.flash.waitForDisplayed({ timeout: 3000 });
        await expect(await FormPage.flash).toHaveText(
            expect.stringContaining('You logged into a secure area!'));
    });
});
