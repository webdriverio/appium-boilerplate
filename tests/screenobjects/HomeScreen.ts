import AppScreen from './AppScreen.js';

const SELECTORS = {
    SCREEN: '~Home-screen',
};

class HomeScreen extends AppScreen {
    constructor () {
        super(SELECTORS.SCREEN);
    }
}

export default new HomeScreen();
