import AppScreen from './AppScreen.js';
const SWIPE_SCREEN_SELECTOR = '//*[@name="Swipe-screen"]';

class SwipeScreen extends AppScreen {
    constructor () {
        super(SWIPE_SCREEN_SELECTOR);
    }

    get screen () {return $(SWIPE_SCREEN_SELECTOR);}
    get logo () {return $('//*[@name="WebdriverIO logo"]');}

}

export default new SwipeScreen();
