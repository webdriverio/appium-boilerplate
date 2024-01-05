import TabBar from '../screenobjects/components/TabBar.js';
import SwipeScreen from '../screenobjects/SwipeScreen.js';
import Carousel from '../screenobjects/components/Carousel.js';
import Gestures, { DIRECTIONS } from '../helpers/Gestures.js';

describe('WebdriverIO and Appium, when using swiping', () => {
    beforeEach(async () => {
        await TabBar.waitForTabBarShown();
        await TabBar.openSwipe();
        await SwipeScreen.waitForIsShown(true);
    });

    it('should be able to swipe horizontal by swiping the carousel from left to right', async () => {
        /**
         * To understand what happens in `isCardActive()` please check the method
         */
        await expect(await Carousel.isCardActive(await Carousel.openSourceCard)).toBeTruthy();

        /**
         * To understand what happens in `swipeLeft()` please check the method
         */
        await Carousel.swipeLeft();
        await expect(await Carousel.isCardActive(await Carousel.communityCard)).toBeTruthy();

        await Carousel.swipeLeft();
        await expect(await Carousel.isCardActive(await Carousel.jsFoundationCard)).toBeTruthy();

        await Carousel.swipeLeft();
        await expect(await Carousel.isCardActive(await Carousel.supportVideosCard)).toBeTruthy();

        await Carousel.swipeLeft();
        await Carousel.swipeLeft();
        await expect(await Carousel.isCardActive(await Carousel.compatibleCard)).toBeTruthy();

        /**
         * To understand what happens in `swipeRight()` please check the method
         */
        await Carousel.swipeRight();
        await expect(await Carousel.isCardActive(await Carousel.extendableCard)).toBeTruthy();

        await Carousel.swipeRight();
        await Carousel.swipeRight();
        await Carousel.swipeRight();
        await Carousel.swipeRight();
        await expect(await Carousel.isCardActive(await Carousel.openSourceCard)).toBeTruthy();
    });

    it('should be able to swipe vertical by finding the surprise', async ()=>{
        // Swipe vertical and try to find the element. You can only swipe a max of 5 times
        await Gestures.checkIfDisplayedWithSwipe({
            scrollContainer: await SwipeScreen.screen,
            searchableElement: await SwipeScreen.logo,
            maxScrolls: 5,
            direction: DIRECTIONS.UP,
            percentage: 0.95,
        });
        await expect(SwipeScreen.logo).toBeDisplayed();
    });
});
