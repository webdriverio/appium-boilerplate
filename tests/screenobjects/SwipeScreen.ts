import AppScreen from './AppScreen';

class SwipeScreen extends AppScreen {
    constructor () {
        super('~Swipe-screen');
    }

    get logo ():WebdriverIO.Element {return $('~WebdriverIO logo');}
}

export default new SwipeScreen();
