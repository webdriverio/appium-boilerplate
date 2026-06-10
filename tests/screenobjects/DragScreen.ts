import AppScreen from './AppScreen.js';

const SELECTORS = {
    SCREEN: '~Drag-drop-screen',
    DRAG_L1: '~drag-l1', DRAG_C1: '~drag-c1', DRAG_R1: '~drag-r1',
    DRAG_L2: '~drag-l2', DRAG_C2: '~drag-c2', DRAG_R2: '~drag-r2',
    DRAG_L3: '~drag-l3', DRAG_C3: '~drag-c3', DRAG_R3: '~drag-r3',
    DROP_L1: '~drop-l1', DROP_C1: '~drop-c1', DROP_R1: '~drop-r1',
    DROP_L2: '~drop-l2', DROP_C2: '~drop-c2', DROP_R2: '~drop-r2',
    DROP_L3: '~drop-l3', DROP_C3: '~drop-c3', DROP_R3: '~drop-r3',
    RENEW: '~renew',
    RETRY: '~button-Retry',
};

class DragScreen extends AppScreen {
    constructor() {
        super(SELECTORS.SCREEN);
    }

    // ~Drag-drop-screen is a plain View on iOS 26.x — not in the accessibility tree. Use a drag item instead.
    override async waitForIsShown (isShown = true): Promise<boolean | void> {
        return $(SELECTORS.DRAG_L1).waitForDisplayed({
            reverse: !isShown,
            timeoutMsg: `Screen (Drag-drop) not ${isShown ? 'shown' : 'hidden'} within timeout`,
        });
    }

    get dragL1() {return $(SELECTORS.DRAG_L1);}
    get dragC1() {return $(SELECTORS.DRAG_C1);}
    get dragR1() {return $(SELECTORS.DRAG_R1);}
    get dragL2() {return $(SELECTORS.DRAG_L2);}
    get dragC2() {return $(SELECTORS.DRAG_C2);}
    get dragR2() {return $(SELECTORS.DRAG_R2);}
    get dragL3() {return $(SELECTORS.DRAG_L3);}
    get dragC3() {return $(SELECTORS.DRAG_C3);}
    get dragR3() {return $(SELECTORS.DRAG_R3);}
    get dropL1() {return $(SELECTORS.DROP_L1);}
    get dropC1() {return $(SELECTORS.DROP_C1);}
    get dropR1() {return $(SELECTORS.DROP_R1);}
    get dropL2() {return $(SELECTORS.DROP_L2);}
    get dropC2() {return $(SELECTORS.DROP_C2);}
    get dropR2() {return $(SELECTORS.DROP_R2);}
    get dropL3() {return $(SELECTORS.DROP_L3);}
    get dropC3() {return $(SELECTORS.DROP_C3);}
    get dropR3() {return $(SELECTORS.DROP_R3);}
    private get renew() {return $(SELECTORS.RENEW);}
    private get retry() {return $(SELECTORS.RETRY);}

    async waitForRetryButton(){
        return this.retry.waitForDisplayed({ timeoutMsg: 'Retry button not shown within timeout' });
    }

    async tapOnRetryButton(){
        return this.retry.click();
    }

    async tapOnRenewButton(){
        return this.renew.click();
    }

    async waitForRenewButton(){
        return this.renew.waitForDisplayed({ timeoutMsg: 'Renew button not shown within timeout' });
    }
}

export default new DragScreen();
