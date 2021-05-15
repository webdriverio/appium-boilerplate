import AppScreen from './AppScreen';

const SELECTORS = {
    SWIPE_SCREEN: '~Swipe-screen',
    LOGO: '~WebdriverIO logo',
};

class SwipeScreen extends AppScreen {
    constructor () {
        super(SELECTORS.SWIPE_SCREEN);
    }

    get logo ():WebdriverIO.Element {
        return $(SELECTORS.LOGO);
    }
}

export default new SwipeScreen();
