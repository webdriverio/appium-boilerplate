import AppScreen from './app.screen';
import Carousel from './components/carousel';

const SELECTORS = {
    SWIPE_SCREEN: '~Swipe-screen'
};

class SwipeScreen extends AppScreen {
    constructor () {
        super(SELECTORS.SWIPE_SCREEN);
    }

    get carousel () {
        return Carousel;
    }
}

export default new SwipeScreen();
