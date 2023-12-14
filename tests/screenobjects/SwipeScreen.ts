import AppScreen from './AppScreen.js';

class SwipeScreen extends AppScreen {
    constructor () {
        super('~Swipe-screen');
    }

    get logo () {return $('~WebdriverIO logo');}
}

export default new SwipeScreen();
