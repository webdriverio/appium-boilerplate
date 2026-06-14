import TabBar from '../screenobjects/components/TabBar.js';
import SwipeScreen from '../screenobjects/SwipeScreen.js';
import Carousel from '../screenobjects/components/Carousel.js';

describe('WebdriverIO and Appium, when using swiping', () => {
    beforeEach(async () => {
        await TabBar.waitForTabBarShown();
        await TabBar.openSwipe();
        await SwipeScreen.waitForIsShown(true);
    });

    it('should be able to swipe horizontal by swiping the carousel from left to right', async () => {
        // waitForCardActive polls until the card's x position is 0 (fully visible).
        // This handles swipe animation settling time without a fixed sleep.
        await Carousel.waitForCardActive(Carousel.openSourceCard);

        await Carousel.swipeLeft();
        await Carousel.waitForCardActive(Carousel.communityCard);

        await Carousel.swipeLeft();
        await Carousel.waitForCardActive(Carousel.jsFoundationCard);

        await Carousel.swipeLeft();
        await Carousel.waitForCardActive(Carousel.supportVideosCard);

        await Carousel.swipeLeft();
        await Carousel.waitForCardActive(Carousel.extendableCard);

        await Carousel.swipeLeft();
        await Carousel.waitForCardActive(Carousel.compatibleCard);

        await Carousel.swipeRight();
        await Carousel.waitForCardActive(Carousel.extendableCard);

        await Carousel.swipeRight();
        await Carousel.waitForCardActive(Carousel.supportVideosCard);

        await Carousel.swipeRight();
        await Carousel.waitForCardActive(Carousel.jsFoundationCard);

        await Carousel.swipeRight();
        await Carousel.waitForCardActive(Carousel.communityCard);

        await Carousel.swipeRight();
        await Carousel.waitForCardActive(Carousel.openSourceCard);
    });

    // There's an issue in the Android app with the carousel. You can't swipe up the screen when you starting point is on the carousel.
    // For now we skip this test for Android.
    // The guard must be inside a before hook — driver.isAndroid is not available at module evaluation time.
    describe('vertical swipe', () => {
        before(function () {
            if (driver.isAndroid) {
                this.skip();
            }
        });

        it('should be able to swipe vertical by finding the surprise', async () => {
            // Finding the logo will be done with the "new" `scrollIntoView` method which now supports native apps as well
            await SwipeScreen.logo.scrollIntoView({
                scrollableElement: SwipeScreen.screen,
                direction: 'up',
                maxScrolls: 5,
                percent: 0.99,
            });
            await expect(SwipeScreen.logo).toBeDisplayed();
        });
    });

});
