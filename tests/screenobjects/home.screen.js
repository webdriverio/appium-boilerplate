import AppScreen from './app.screen';

const SELECTORS = {
    HOME_SCREEN: '~Home-screen'
};

class HomeScreen extends AppScreen {
    constructor () {
        super(SELECTORS.HOME_SCREEN);
    }
}

export default new HomeScreen();
