import TabBar from '../screenobjects/components/tab.bar';
import SwipeScreen from '../screenobjects/swipe.screen';

describe('WebdriverIO and Appium', () => {
    beforeEach(() => {
        TabBar.waitForTabBarShown(true);
        TabBar.openSwipe();
        SwipeScreen.waitForIsShown(true);
    });

    it('should be able to swipe the carousel from left to right', () => {
        SwipeScreen.carousel.verifyNthCardContainsText('first', 'Fully Open Source');

        SwipeScreen.carousel.swipeLeft();
        SwipeScreen.carousel.verifyNthCardContainsText('active', 'Creat community');

        SwipeScreen.carousel.swipeLeft();
        SwipeScreen.carousel.verifyNthCardContainsText('active', 'JS.Foundation');

        SwipeScreen.carousel.swipeLeft();
        SwipeScreen.carousel.verifyNthCardContainsText('active', 'Support Videos');

        SwipeScreen.carousel.swipeLeft();
        SwipeScreen.carousel.swipeLeft();
        SwipeScreen.carousel.verifyNthCardContainsText('active', 'Compatible');

        SwipeScreen.carousel.swipeRight();
        SwipeScreen.carousel.verifyNthCardContainsText('active', 'Extendable');

        SwipeScreen.carousel.swipeRight();
        SwipeScreen.carousel.swipeRight();
        SwipeScreen.carousel.swipeRight();
        SwipeScreen.carousel.swipeRight();
        SwipeScreen.carousel.verifyNthCardContainsText('first', 'Fully Open Source');
    });
});
