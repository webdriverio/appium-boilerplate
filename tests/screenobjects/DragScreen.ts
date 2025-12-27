import AppScreen from './AppScreen.js';

class DragScreen extends AppScreen {
    constructor() {
        super('//*[@name="Drag-drop-screen"]');
    }

    get dragL1() {return $('//*[@name="drag-l1"]');}
    get dragC1() {return $('//*[@name="drag-c1"]');}
    get dragR1() {return $('//*[@name="drag-r1"]');}
    get dragL2() {return $('//*[@name="drag-l2"]');}
    get dragC2() {return $('//*[@name="drag-c2"]');}
    get dragR2() {return $('//*[@name="drag-r2"]');}
    get dragL3() {return $('//*[@name="drag-l3"]');}
    get dragC3() {return $('//*[@name="drag-c3"]');}
    get dragR3() {return $('//*[@name="drag-r3"]');}
    get dropL1() {return $('//*[@name="drop-l1"]');}
    get dropC1() {return $('//*[@name="drop-c1"]');}
    get dropR1() {return $('//*[@name="drop-r1"]');}
    get dropL2() {return $('//*[@name="drop-l2"]');}
    get dropC2() {return $('//*[@name="drop-c2"]');}
    get dropR2() {return $('//*[@name="drop-r2"]');}
    get dropL3() {return $('//*[@name="drop-l3"]');}
    get dropC3() {return $('//*[@name="drop-c3"]');}
    get dropR3() {return $('//*[@name="drop-r3"]');}
    private get renew() {return $('//*[@name="renew"]');}
    private get retry() {return $('//*[@name="button-Retry"]');}

    async waitForRetryButton(){
        return this.retry.waitForDisplayed();
    }

    async tapOnRetryButton(){
        return this.retry.click();
    }

    async tapOnRenewButton(){
        return this.renew.click();
    }

    async waitForRenewButton(){
        return this.renew.waitForDisplayed();
    }
}

export default new DragScreen();
