import CheckboxPage from '../pageobjects/checkbox.page';

describe('checkboxes', () => {
    it('checkbox 2 should be enabled',  () => {
        CheckboxPage.open();
        CheckboxPage.firstCheckbox.waitForDisplayed({ timeout: 3000 });
        expect(CheckboxPage.firstCheckbox).not.toBeChecked();
        expect(CheckboxPage.lastCheckbox).toBeChecked();
    });

    it('checkbox 1 should be enabled after clicking on it',  () => {
        CheckboxPage.open();
        CheckboxPage.firstCheckbox.waitForDisplayed({ timeout: 3000 });
        expect(CheckboxPage.firstCheckbox).not.toBeSelected();
        CheckboxPage.firstCheckbox.click();
        expect(CheckboxPage.firstCheckbox).toBeSelected();
    });
});
