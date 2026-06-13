// Carousel uses accessibility IDs on iOS and resource IDs on Android.
// The SELECTORS map stores both forms so no raw strings appear in getters.
const SELECTORS = {
    ios: (id: string) => `~${id}`,
    android: (id: string) => `android=new UiSelector().resourceId("${id}")`,
} as const;

const CAROUSEL_IDS = {
    CAROUSEL: 'Carousel',
    OPEN_SOURCE: '__CAROUSEL_ITEM_0__',
    COMMUNITY: '__CAROUSEL_ITEM_1__',
    JS_FOUNDATION: '__CAROUSEL_ITEM_2__',
    SUPPORT_VIDEOS: '__CAROUSEL_ITEM_3__',
    EXTENDABLE: '__CAROUSEL_ITEM_4__',
    COMPATIBLE: '__CAROUSEL_ITEM_5__',
} as const;

class Carousel {
    private locatorStrategy(id: string): string {
        return driver.isIOS ? SELECTORS.ios(id) : SELECTORS.android(id);
    }

    get carousel() {
        return $(this.locatorStrategy(CAROUSEL_IDS.CAROUSEL));
    }
    get openSourceCard() {
        return $(this.locatorStrategy(CAROUSEL_IDS.OPEN_SOURCE));
    }
    get communityCard() {
        return $(this.locatorStrategy(CAROUSEL_IDS.COMMUNITY));
    }
    get jsFoundationCard() {
        return $(this.locatorStrategy(CAROUSEL_IDS.JS_FOUNDATION));
    }
    get supportVideosCard() {
        return $(this.locatorStrategy(CAROUSEL_IDS.SUPPORT_VIDEOS));
    }
    get extendableCard() {
        return $(this.locatorStrategy(CAROUSEL_IDS.EXTENDABLE));
    }
    get compatibleCard() {
        return $(this.locatorStrategy(CAROUSEL_IDS.COMPATIBLE));
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
