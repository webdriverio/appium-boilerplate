import AppScreen from './AppScreen.js';
const SWIPE_SCREEN_SELECTOR = '~Swipe-screen';

class SwipeScreen extends AppScreen {
    constructor () {
        super(SWIPE_SCREEN_SELECTOR);
    }

    get screen () {return $(SWIPE_SCREEN_SELECTOR);}
    get logo () {return $('~WebdriverIO logo');}

}

export default new SwipeScreen();
