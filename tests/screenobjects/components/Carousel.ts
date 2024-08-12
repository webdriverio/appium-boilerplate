import Gestures from "../../helpers/Gestures.js";
import type { RectReturn } from "@wdio/protocols";

let CAROUSEL_RECTANGLES: RectReturn;

class Carousel extends Gestures {
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
            (await driver.getElementRect((await this.carousel).elementId));

        return CAROUSEL_RECTANGLES;
    }

    /**
     * Swipe the carousel to the LEFT (from right to left)
     */
    async swipeLeft() {
        // Determine the rectangles of the carousel
        const carouselRectangles = await this.getCarouselRectangles();
        // We need to determine the center position of the carousel on the screen. This can be done by taking the
        // starting position (carouselRectangles.y) and add half of the height of the carousel to it.
        const y = Math.round(
            carouselRectangles.y + carouselRectangles.height / 2
        );

        // Execute the gesture by providing a starting position and an end position
        // Check the Gestures class for more information about the swipe method
        await Gestures.executeGesture({
            // Here we start on the right of the carousel. To make sure that we don't touch the outer most right
            // part of the screen we take 10% of the x-position. The y-position has already been determined.
            from: {
                x: Math.round(
                    carouselRectangles.width - carouselRectangles.width * 0.1
                ),
                y,
            },
            // Here we end on the left of the carousel. To make sure that we don't touch the outer most left
            // part of the screen we add 10% to the x-position. The y-position has already been determined.
            to: {
                x: Math.round(
                    carouselRectangles.x + carouselRectangles.width * 0.1
                ),
                y,
            },
        });
    }

    /**
     * Swipe the carousel to the RIGHT (from left to right)
     */
    async swipeRight() {
        // Determine the rectangles of the carousel
        const carouselRectangles = await this.getCarouselRectangles();
        // We need to determine the center position of the carousel on the screen. This can be done by taking the
        // starting position (carouselRectangles.y) and add half of the height of the carousel to it.
        const y = Math.round(
            carouselRectangles.y + carouselRectangles.height / 2
        );

        // Execute the gesture by providing a starting position and an end position
        // Check the Gestures class for more information about the swipe method
        await Gestures.executeGesture({
            // Here we start on the left of the carousel. To make sure that we don't touch the outer most left
            // part of the screen we add 10% to the x-position. The y-position has already been determined.
            from: {
                x: Math.round(
                    carouselRectangles.x + carouselRectangles.width * 0.1
                ),
                y,
            },
            // Here we end on the right of the carousel. To make sure that we don't touch the outer most right
            // part of the screen we take 10% of the x-position. The y-position has already been determined.
            to: {
                x: Math.round(
                    carouselRectangles.width - carouselRectangles.width * 0.1
                ),
                y,
            },
        });
    }
}

export default new Carousel();
