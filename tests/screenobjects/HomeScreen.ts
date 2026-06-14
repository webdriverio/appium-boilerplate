import AppScreen from './AppScreen.js';

const SELECTORS = {
    SCREEN: '~Home-screen',
    // The Home tab-bar button is an interactive XCUIElementTypeButton — always in the
    // accessibility tree on iOS 26.x even when the plain ~Home-screen View is not.
    TAB_HOME: '~Home',
};

class HomeScreen extends AppScreen {
    constructor () {
        super(SELECTORS.SCREEN);
    }

    // ~Home-screen is a plain View on iOS 26.x — not reliably in the accessibility tree.
    // Use the Home tab-bar button (an interactive element) as the anchor instead.
    override async waitForIsShown (isShown = true): Promise<boolean | void> {
        return $(SELECTORS.TAB_HOME).waitForDisplayed({
            reverse: !isShown,
            timeoutMsg: `Screen (Home) not ${isShown ? 'shown' : 'hidden'} within timeout`,
        });
    }
}

export default new HomeScreen();
