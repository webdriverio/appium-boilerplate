import TabBar from '../screenobjects/components/tab.bar';
import SwipeScreen from '../screenobjects/swipe.screen';

describe('WebdriverIO and Appium', () => {
    beforeEach(() => {
        TabBar.waitForTabBarShown(true);
        TabBar.openSwipe();
        SwipeScreen.waitForIsShown(true);
    });

    it('should be able to swipe the carousel from left to right', () => {
        expect(SwipeScreen.carousel.verifyNthCardContainsText('first', 'Fully Open Source'));

        SwipeScreen.carousel.swipeLeft();
        expect(SwipeScreen.carousel.verifyNthCardContainsText('active', 'Creat community'));

        SwipeScreen.carousel.swipeLeft();
        expect(SwipeScreen.carousel.verifyNthCardContainsText('active', 'JS.Foundation'));

        SwipeScreen.carousel.swipeLeft();
        expect(SwipeScreen.carousel.verifyNthCardContainsText('active', 'Support Videos'));

        SwipeScreen.carousel.swipeLeft();
        SwipeScreen.carousel.swipeLeft();
        expect(SwipeScreen.carousel.verifyNthCardContainsText('active', 'Compatible'));

        SwipeScreen.carousel.swipeRight();
        expect(SwipeScreen.carousel.verifyNthCardContainsText('active', 'Extendable'));

        SwipeScreen.carousel.swipeRight();
        SwipeScreen.carousel.swipeRight();
        SwipeScreen.carousel.swipeRight();
        SwipeScreen.carousel.swipeRight();
        expect(SwipeScreen.carousel.verifyNthCardContainsText('first', 'Fully Open Source'));
    });
});
