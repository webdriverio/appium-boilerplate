import type { RectReturn } from "@wdio/protocols";

let CAROUSEL_RECTANGLES: RectReturn;

class Carousel {
    get carousel() {
        return $("~Carousel");
    }
    get openSourceCard() {
        return $(this.locatorStrategy("__CAROUSEL_ITEM_0_READY__"));
    }
    get communityCard() {
        return $(this.locatorStrategy("__CAROUSEL_ITEM_1_READY__"));
    }
    get jsFoundationCard() {
        return $(this.locatorStrategy("__CAROUSEL_ITEM_2_READY__"));
    }
    get supportVideosCard() {
        return $(this.locatorStrategy("__CAROUSEL_ITEM_3_READY__"));
    }
    get extendableCard() {
        return $(this.locatorStrategy("__CAROUSEL_ITEM_4_READY__"));
    }
    get compatibleCard() {
        return $(this.locatorStrategy("__CAROUSEL_ITEM_5_READY__"));
    }

    private locatorStrategy(selector: string): string {
        return driver.isIOS
            ? `~${selector}`
            : `//*[@resource-id="${selector}"]`;
    }

    /**
     * Wait for the carousel to be (un)visible
     *
     * @param {boolean} isShown
     */
    async waitForIsDisplayed(isShown = true) {
        await this.carousel.waitForDisplayed({
            reverse: !isShown,
        });
    }

    /**
     * There are 6 cards in the carousel, but only 1 is fully, and 1 is partially visible.
     * We can validate which card is active by checking if it is fully visible.
     * This can be done by checking if the card has position x=0.
     */
    async isCardActive(card: ChainablePromiseElement) {
        const cardRectangles = await driver.getElementRect(card.elementId);

        return cardRectangles.x === 0;
    }

    /**
     * Get the carousel position and size
     */
    async getCarouselRectangles(): Promise<RectReturn> {
        // Get the rectangles of the carousel and store it in a global that will be used for a next call.
        // We don't want ask for the rectangles of the carousel if we already know them.
        // This will save unneeded webdriver calls.
        CAROUSEL_RECTANGLES =
            CAROUSEL_RECTANGLES ||
            (await driver.getElementRect(await this.carousel.elementId));

        return CAROUSEL_RECTANGLES;
    }

    /**
     * Swipe the carousel to the LEFT (from right to left)
     */
    async swipeLeft() {
        // This uses the "new" `swipe` method that now supports native apps
        await driver.swipe({
            direction: "left",
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
            direction: "right",
            scrollableElement: this.carousel,
            percent: 0.8,
        });
    }
}

export default new Carousel();
