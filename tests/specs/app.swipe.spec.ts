import TabBar from '../screenobjects/components/TabBar';
import SwipeScreen from '../screenobjects/SwipeScreen';
import Carousel from '../screenobjects/components/Carousel';
import Gestures from '../helpers/Gestures';

describe('WebdriverIO and Appium, when using swiping', () => {
    beforeEach(() => {
        TabBar.waitForTabBarShown();
        TabBar.openSwipe();
        SwipeScreen.waitForIsShown(true);
    });

    fit('should be able to swipe horizontal by swiping the carousel from left to right', () => {
        /**
         * To understand what happens in `getNthCardText()` please check the method
         */
        expect(Carousel.getNthCardText('first')).toContain('FULLY OPEN SOURCE');

        /**
         * To understand what happens in `swipeLeft()` please check the method
         */
        Carousel.swipeLeft();
        expect(Carousel.getNthCardText('active')).toContain('GREAT COMMUNITY');

        Carousel.swipeLeft();
        expect(Carousel.getNthCardText('active')).toContain( 'JS.FOUNDATION');

        Carousel.swipeLeft();
        expect(Carousel.getNthCardText('active')).toContain( 'SUPPORT VIDEOS');

        Carousel.swipeLeft();
        Carousel.swipeLeft();
        expect(Carousel.getNthCardText('active')).toContain('COMPATIBLE');

        /**
         * To understand what happens in `swipeRight()` please check the method
         */
        Carousel.swipeRight();
        expect(Carousel.getNthCardText('active')).toContain('EXTENDABLE');

        Carousel.swipeRight();
        Carousel.swipeRight();
        Carousel.swipeRight();
        Carousel.swipeRight();
        expect(Carousel.getNthCardText('first')).toContain('FULLY OPEN SOURCE');
    });

    it('should be able to swipe vertical by finding the surprise', ()=>{
        // Swipe horizontal and try to find the element. You can only swipe a max of 5 times
        Gestures.checkIfDisplayedWithSwipeUp(SwipeScreen.logo, 5);
        expect(SwipeScreen.logo).toBeVisible();
    });
});
