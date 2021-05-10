import AppScreen from './AppScreen';

const SELECTORS = {
    DRAG_SCREEN: '~Drag-drop-screen'
};

class DragScreen extends AppScreen {
    constructor () {
        super(SELECTORS.DRAG_SCREEN);
    }
}

export default new DragScreen();
