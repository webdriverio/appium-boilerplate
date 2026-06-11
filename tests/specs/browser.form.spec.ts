import FormPage from '../pageobjects/form.page.js';
import { TIMEOUTS } from '../helpers/Constants.js';

describe('auth form', () => {
    it('should deny access with wrong credentials',  async () => {
        await FormPage.open();
        await FormPage.login({ username:'foo', password: 'bar!' });
        await FormPage.flash.waitForDisplayed({ timeout: TIMEOUTS.VERY_SHORT, timeoutMsg: 'Flash message not visible after invalid login' });
        await expect(await FormPage.flash).toHaveText(
            expect.stringContaining('Your username is invalid!'));
    });

    it('should allow access with correct credentials',  async () => {
        await FormPage.open();
        await FormPage.login({ username:'tomsmith', password: 'SuperSecretPassword!' });
        await FormPage.flash.waitForDisplayed({ timeout: TIMEOUTS.VERY_SHORT, timeoutMsg: 'Flash message not visible after valid login' });
        await expect(await FormPage.flash).toHaveText(
            expect.stringContaining('You logged into a secure area!'));
    });
});
