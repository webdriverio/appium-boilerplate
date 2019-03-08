import Gestures from '../../helpers/Gestures';
import { DEFAULT_TIMEOUT } from '../../constants';
import { getTextOfElement } from '../../helpers/utils';

const SELECTORS = {
    CAROUSEL: '~Carousel',
    CARD: '~card',
};

let CAROUSEL_RECTANGLES;

class Carousel extends Gestures {
    /**
     * Wait for the carousel to be (un)visible
     *
     * @param {boolean} isShown
     */
    waitForIsDisplayed (isShown = true) {
        $(SELECTORS.CAROUSEL).waitForDisplayed(DEFAULT_TIMEOUT, !isShown);
    }

    /**
     * Verify that the chosen card contains a certain text.
     * Carousel only has a max of 3 elements when 3 or more cards are provided
     * When the first or last card is active then 2 elements are present
     *
     * if first card is active
     *    the first of 2 elements is the active card
     * else if last card is active
     *    the last of 2 elements is the active card
     * else
     *    there are 3 elements and the active card is the middle one
     *
     * @param {string} nthCard Use 'first' to indicate the first card,
     *                 else use a different word to indicate the other card
     *                 like for example 'active'
     * @param {string} partialText
     */
    verifyNthCardContainsText (nthCard, partialText) {
        this.waitForIsDisplayed();

        const cards = $$(SELECTORS.CARD);
        driver.waitUntil(
            () => cards.length > 0,
            DEFAULT_TIMEOUT,
            `Expected to have more than 0 cards withing ${DEFAULT_TIMEOUT} milliseconds`,
        );

        const cardNumber = (nthCard === 'first' || cards.length === 1) ? 0 : 1;
        const cardText = getTextOfElement(cards[cardNumber]).replace(/(?:\r\n|\r|\n)/g, ' ').toLowerCase();
        const expectedText = partialText.toLowerCase();

        if (driver.isIOS) {
            return expect(cardText).toContain(expectedText);
        }

        /**
         * Needed to implement this for Android because the `flex:wrap` returns an incorrect order
         * of the text so we need to split words and verify then
         */
        return expectedText.split(' ')
            .forEach(word =>
                global.expect(cardText).toContain(word));
    }

    /**
     * Swipe the carousel to the LEFT (from right to left)
     */
    swipeLeft () {
        const carouselRectangles = this.getCarouselRectangles();
        const y = Math.round((carouselRectangles.y + carouselRectangles.height) / 2);
        Gestures.swipe(
            { x: Math.round(carouselRectangles.width - (carouselRectangles.width * 0.20)), y },
            { x: Math.round(carouselRectangles.x + (carouselRectangles.width * 0.20)), y },
        );
    }

    /**
     * Swipe the carousel to the RIGHT (from left to right)
     */
    swipeRight () {
        const carouselRectangles = this.getCarouselRectangles();
        const y = Math.round((carouselRectangles.y + carouselRectangles.height) / 2);
        Gestures.swipe(
            { x: Math.round(carouselRectangles.x + (carouselRectangles.width * 0.20)), y },
            { x: Math.round(carouselRectangles.width - (carouselRectangles.width * 0.20)), y },
        );
    }

    /**
     * Get the carousel position and size
     *
     * @return
     *  x: number,
     *  y: number,
     *  width: number,
     *  height: number,
     *
     * @example
     *
     * <pre>
     *   const result = {
     *      x: 0,
     *      y: 297,
     *      width: 375,
     *      height: 395
     *    };
     * </pre>
     */
    getCarouselRectangles () {
        CAROUSEL_RECTANGLES = CAROUSEL_RECTANGLES || driver.getElementRect($(SELECTORS.CAROUSEL).elementId);
        return CAROUSEL_RECTANGLES;
    }
}

export default new Carousel();
