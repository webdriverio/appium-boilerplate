import AppScreen from './AppScreen';

class SwipeScreen extends AppScreen {
    constructor () {
        super('~Swipe-screen');
    }

    get logo () {return $('~WebdriverIO logo');}
}

export default new SwipeScreen();
