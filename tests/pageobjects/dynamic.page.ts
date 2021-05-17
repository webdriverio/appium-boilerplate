import Page from './page';

class DynamicPage extends Page {
    /**
     * define elements
     */
    get btnStart ():WebdriverIO.Element { return $('button=Start'); }
    get loadedPage ():WebdriverIO.Element { return $('#finish'); }

    /**
     * define or overwrite page methods
     */
    open ():string {
        return super.open('dynamic_loading/2');
    }
}

export default new DynamicPage();
