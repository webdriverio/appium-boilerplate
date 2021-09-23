import AppScreen from './AppScreen';

class DragScreen extends AppScreen {
    constructor() {
        super('~Drag-drop-screen');
    }

    get dragL1() {return $('~drag-l1');}
    get dragC1() {return $('~drag-c1');}
    get dragR1() {return $('~drag-r1');}
    get dragL2() {return $('~drag-l2');}
    get dragC2() {return $('~drag-c2');}
    get dragR2() {return $('~drag-r2');}
    get dragL3() {return $('~drag-l3');}
    get dragC3() {return $('~drag-c3');}
    get dragR3() {return $('~drag-r3');}
    get dropL1() {return $('~drop-l1');}
    get dropC1() {return $('~drop-c1');}
    get dropR1() {return $('~drop-r1');}
    get dropL2() {return $('~drop-l2');}
    get dropC2() {return $('~drop-c2');}
    get dropR2() {return $('~drop-r2');}
    get dropL3() {return $('~drop-l3');}
    get dropC3() {return $('~drop-c3');}
    get dropR3() {return $('~drop-r3');}
    private get renew() {return $('~renew');}
    private get retry() {return $('~button-Retry');}

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

    /**
     * Drag an element to a position.
     */
    async dragElementTo(elementOne: WebdriverIO.Element, elementTwo: WebdriverIO.Element) {
        await driver.performActions([
            {
                // 1. Create the event
                type: 'pointer',
                id: 'finger1',
                parameters: { pointerType: 'touch' },
                actions: [
                    // 2. Move finger into start position where the element is
                    //    Appium can automatically determine the location of the element instead
                    //    of doing it ourselves
                    { type: 'pointerMove', duration: 0, origin: elementOne.elementId  },
                    // 3. Finger comes down into contact with screen
                    { type: 'pointerDown', button: 0 },
                    // 4. Pause for a little bit
                    { type: 'pause', duration: 100 },
                    // 5. Finger moves to the second element.
                    //    Appium can automatically determine the location of the element instead
                    //    of doing it ourselves
                    { type: 'pointerMove', duration: 250, origin: elementTwo.elementId  },
                    // 6. Finger lets up, off the screen
                    { type: 'pointerUp', button: 0 },
                ],
            },
        ]);

        // Add a pause, just to make sure the drag and drop is done
        await driver.pause(1000);
    }
}

export default new DragScreen();
