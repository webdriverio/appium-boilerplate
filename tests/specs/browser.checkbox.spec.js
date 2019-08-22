import CheckboxPage from '../pageobjects/checkbox.page';

describe('checkboxes', () => {
    it('checkbox 2 should be enabled', () => {
        CheckboxPage.open();
        CheckboxPage.firstCheckbox.waitForDisplayed(3000);
        expect(CheckboxPage.firstCheckbox.isSelected()).toEqual(false);
        expect(CheckboxPage.lastCheckbox.isSelected()).toEqual(true);
    });

    it('checkbox 1 should be enabled after clicking on it', () => {
        CheckboxPage.open();
        CheckboxPage.firstCheckbox.waitForDisplayed(3000);
        expect(CheckboxPage.firstCheckbox.isSelected()).toEqual(false);
        CheckboxPage.firstCheckbox.click();
        expect(CheckboxPage.firstCheckbox.isSelected()).toEqual(true);
    });
});
