import Page from './page';

class CheckboxPage extends Page {
    /**
     * define elements
     */
    get lastCheckbox ():WebdriverIO.Element { return $('#checkboxes input:last-Child'); }
    get firstCheckbox ():WebdriverIO.Element { return $('#checkboxes input:first-Child'); }

    /**
     * overwrite specificoptions to adapt itto page object
     */
    open ():string {
        return super.open('checkboxes');
    }
}

export default new CheckboxPage();
