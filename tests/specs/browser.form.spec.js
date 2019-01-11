import FormPage from '../pageobjects/form.page';

describe('auth form', () => {
    it('should deny access with wrong creds', () => {
        FormPage.open();
        FormPage.username.setValue('foo');
        FormPage.password.setValue('bar');
        FormPage.submit();
        FormPage.flash.waitForDisplayed(3000);
        expect(FormPage.flash.getText()).toContain('Your username is invalid!');
    });

    it('should allow access with correct creds', () => {
        FormPage.open();
        FormPage.username.setValue('tomsmith');
        FormPage.password.setValue('SuperSecretPassword!');
        FormPage.submit();
        FormPage.flash.waitForDisplayed(3000);
        expect(FormPage.flash.getText()).toContain('You logged into a secure area!');
    });
});
