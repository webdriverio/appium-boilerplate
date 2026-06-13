import AppScreen from './AppScreen.js';

const SELECTORS = {
    SCREEN: '~Swipe-screen',
    LOGO: '~WebdriverIO logo',
    CAROUSEL: '~Carousel',
};

class SwipeScreen extends AppScreen {
    constructor () {
        super(SELECTORS.SCREEN);
    }

    // On iOS 26.x the ~WebdriverIO logo is the "surprise" at the bottom of the
    // scroll view (y≈1374, off-screen, visible="false"), so it is NOT displayed
    // until you swipe up and can never satisfy waitForDisplayed on the freshly
    // opened screen. The ~Carousel is the on-screen, visible="true" content that
    // uniquely identifies the Swipe screen, so use it as the iOS anchor.
    // Android keeps the base ~Swipe-screen root (the selector that already passes).
    override async waitForIsShown (isShown = true): Promise<boolean | void> {
        if (driver.isIOS) {
            return $(SELECTORS.CAROUSEL).waitForDisplayed({
                reverse: !isShown,
                timeoutMsg: `Screen (Swipe) not ${isShown ? 'shown' : 'hidden'} within timeout`,
            });
        }
        return super.waitForIsShown(isShown);
    }

    get screen () {return $(SELECTORS.SCREEN);}
    get logo () {return $(SELECTORS.LOGO);}
}

export default new SwipeScreen();
