import DynamicPage from '../pageobjects/dynamic.page';
import { DEFAULT_TIMEOUT } from '../constants';

describe('dynamic loading', () => {
    it('should be an button on the page', () => {
        DynamicPage.open();

        expect(DynamicPage.loadedPage.isExisting()).toEqual(false);

        DynamicPage.btnStart.click();
        DynamicPage.loadedPage.waitForExist({ timeout: DEFAULT_TIMEOUT });

        expect(DynamicPage.loadedPage.isExisting()).toEqual(true);
    });
});
