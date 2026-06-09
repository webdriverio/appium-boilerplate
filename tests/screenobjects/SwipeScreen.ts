import AppScreen from './AppScreen.js';

const SELECTORS = {
    SCREEN: '~Swipe-screen',
    LOGO: '~WebdriverIO logo',
};

class SwipeScreen extends AppScreen {
    constructor () {
        super(SELECTORS.SCREEN);
    }

    get screen () {return $(SELECTORS.SCREEN);}
    get logo () {return $(SELECTORS.LOGO);}
}

export default new SwipeScreen();
