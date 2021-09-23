import CheckboxPage from '../pageobjects/checkbox.page';

describe('checkboxes', () => {
    it('checkbox 2 should be enabled',  async () => {
        await CheckboxPage.open();
        await CheckboxPage.firstCheckbox.waitForDisplayed({ timeout: 3000 });
        await expect (await CheckboxPage.firstCheckbox).not.toBeChecked();
        await expect(await CheckboxPage.lastCheckbox).toBeChecked();
    });

    it('checkbox 1 should be enabled after clicking on it',  async () => {
        await CheckboxPage.open();
        await CheckboxPage.firstCheckbox.waitForDisplayed({ timeout: 3000 });
        await expect(await CheckboxPage.firstCheckbox).not.toBeSelected();
        await CheckboxPage.firstCheckbox.click();
        await expect(await CheckboxPage.firstCheckbox).toBeSelected();
    });
});
