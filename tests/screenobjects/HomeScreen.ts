import AppScreen from './AppScreen.js';

class HomeScreen extends AppScreen {
    constructor () {
        super('//*[@name="Home-screen"]');
    }
}

export default new HomeScreen();
