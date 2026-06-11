import type { RectReturn } from '@wdio/protocols';

class Carousel {
    /** Cached carousel dimensions — reset per instance so tests don't share stale geometry. */
    private carouselRectanglesCache: RectReturn | undefined = undefined;
    get carousel() {
        return $(this.locatorStrategy('Carousel'));
    }
    get openSourceCard() {
        return $(this.locatorStrategy('__CAROUSEL_ITEM_0__'));
    }
    get communityCard() {
        return $(this.locatorStrategy('__CAROUSEL_ITEM_1__'));
    }
    get jsFoundationCard() {
        return $(this.locatorStrategy('__CAROUSEL_ITEM_2__'));
    }
    get supportVideosCard() {
        return $(this.locatorStrategy('__CAROUSEL_ITEM_3__'));
    }
    get extendableCard() {
        return $(this.locatorStrategy('__CAROUSEL_ITEM_4__'));
    }
    get compatibleCard() {
        return $(this.locatorStrategy('__CAROUSEL_ITEM_5__'));
    }

    private locatorStrategy(selector: string): string {
        return driver.isIOS
            ? `~${selector}`
            : `android=new UiSelector().resourceId("${selector}")`;
    }

    /**
     * Wait for the carousel to be (un)visible
     *
     * @param {boolean} isShown
     */
    async waitForIsDisplayed(isShown = true) {
        await this.carousel.waitForDisplayed({
            reverse: !isShown,
            timeoutMsg: `Carousel not ${isShown ? 'shown' : 'hidden'} within timeout`,
        });
    }

    /**
     * There are 6 cards in the carousel, but only 1 is fully, and 1 is partially visible.
     * We can validate which card is active by checking if it is fully visible.
     * This can be done by checking if the card has position x=0.
     */
    async isCardActive(card: ChainablePromiseElement): Promise<boolean> {
        const elementId = await card.elementId;
        if (!elementId) return false;
        const rect = await driver.getElementRect(elementId);
        return rect.x === 0;
    }

    /**
     * Poll until the given carousel card has settled at position x=0 (i.e. is the active card).
     * Swipe animations take a variable amount of time — polling avoids false failures caused by
     * asserting before the animation completes.
     */
    async waitForCardActive(card: ChainablePromiseElement, timeout = 5000): Promise<void> {
        await driver.waitUntil(
            () => this.isCardActive(card),
            { timeout, interval: 200, timeoutMsg: 'Carousel card did not settle to active position within timeout' },
        );
    }

    /**
     * Get the carousel position and size.
     * Result is cached on the instance to avoid redundant Appium calls within a single test.
     */
    async getCarouselRectangles(): Promise<RectReturn> {
        this.carouselRectanglesCache =
            this.carouselRectanglesCache ??
            (await driver.getElementRect(await this.carousel.elementId));

        return this.carouselRectanglesCache;
    }

    /**
     * Swipe the carousel to the LEFT (from right to left)
     */
    async swipeLeft() {
        // This uses the "new" `swipe` method that now supports native apps
        await driver.swipe({
            direction: 'left',
            scrollableElement: this.carousel,
            percent: 0.8,
        });
    }

    /**
     * Swipe the carousel to the RIGHT (from left to right)
     */
    async swipeRight() {
        // This uses the "new" `swipe` method that now supports native apps
        await driver.swipe({
            direction: 'right',
            scrollableElement: this.carousel,
            percent: 0.8,
        });
    }
}

export default new Carousel();
