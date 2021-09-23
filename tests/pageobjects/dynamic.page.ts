import Page from './page';

class DynamicPage extends Page {
    /**
     * define elements
     */
    get btnStart () { return $('button=Start'); }
    get loadedPage () { return $('#finish'); }

    /**
     * define or overwrite page methods
     */
    async open ():Promise<string> {
        return super.open('dynamic_loading/2');
    }
}

export default new DynamicPage();
