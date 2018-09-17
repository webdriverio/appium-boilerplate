import AppScreen from './app.screen';

const SELECTORS = {
    SWIPE_SCREEN:'~Swipe-screen'
};

class SwipeScreen extends AppScreen{
    constructor(){
        super(SELECTORS.SWIPE_SCREEN);
    }
}

export default new SwipeScreen();
