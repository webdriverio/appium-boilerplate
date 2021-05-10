import AppScreen from './AppScreen';
import Carousel from './components/Carousel';

const SELECTORS = {
    SWIPE_SCREEN: '~Swipe-screen'
};

class SwipeScreen extends AppScreen {
    constructor () {
        super(SELECTORS.SWIPE_SCREEN);
    }

    get carousel ():typeof Carousel {
        return Carousel;
    }
}

export default new SwipeScreen();
