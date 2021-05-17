import Gestures from '../../helpers/Gestures';
import { RectReturn } from '@wdio/protocols/build/types';

const SELECTORS = {
    CAROUSEL: '~Carousel',
    CARD: '~card',
};

let CAROUSEL_RECTANGLES: RectReturn;

class Carousel extends Gestures {
    /**
     * Wait for the carousel to be (un)visible
     *
     * @param {boolean} isShown
     */
    waitForIsDisplayed (isShown = true) {
        $(SELECTORS.CAROUSEL).waitForDisplayed({
            reverse: !isShown,
        });
    }

    /**
     * Get the text of the active cart.
     *
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
     * Use 'first' to indicate the first card, else use a different word to
     * indicate the other card like for example 'active'.
     */
    getNthCardText (nthCard:string):string {
        this.waitForIsDisplayed();

        const cards = $$(SELECTORS.CARD);
        driver.waitUntil(
            () => cards.length > 0,
            {
                timeoutMsg: 'Expected to have more than 0 cards',
            },
        );

        const cardNumber = (nthCard === 'first' || cards.length === 1) ? 0 : 1;
        /**
         * IMPORTANT:
         * iOS gives back the text of all child elements when you call `element.getText()` on the parent element.
         * Android DOES NOT have the text of the child elements on the parent, we need to get them ourselves.
         */
        let cardText: string;

        if (driver.isAndroid) {
            cardText = cards[cardNumber]
                // Get all child text views, this will return an array
                .$$('*//android.widget.TextView')
                // walk over every child element, get the text and add it to the string
                .reduce((currentValue, el) => `${currentValue} ${el.getText()}`, '');
        } else {
            cardText = cards[cardNumber].getText().trim();
        }

        return cardText
            // Replace all possible breaks, tabs and so on with a single space
            .replace(/(?:\r\n|\r|\n)/g, ' ');
    }

    /**
     * Swipe the carousel to the LEFT (from right to left)
     */
    swipeLeft () {
        // Determine the rectangles of the carousel
        const carouselRectangles = this.getCarouselRectangles();
        // We need to determine the center position of the carousel on the screen. This can be done by taking the
        // starting position (carouselRectangles.y) and add half of the height of the carousel to it.
        const y = Math.round(carouselRectangles.y + (carouselRectangles.height / 2));

        // Execute the gesture by providing a starting position and an end position
        Gestures.swipe(
            // Here we start on the right of the carousel. To make sure that we don't touch the outer most right
            // part of the screen we take 10% of the x-position. The y-position has already been determined.
            { x: Math.round(carouselRectangles.width - (carouselRectangles.width * 0.10)), y },
            // Here we end on the left of the carousel. To make sure that we don't touch the outer most left
            // part of the screen we add 10% to the x-position. The y-position has already been determined.
            { x: Math.round(carouselRectangles.x + (carouselRectangles.width * 0.10)), y },
        );
    }

    /**
     * Swipe the carousel to the RIGHT (from left to right)
     */
    swipeRight () {
        // Determine the rectangles of the carousel
        const carouselRectangles = this.getCarouselRectangles();
        // We need to determine the center position of the carousel on the screen. This can be done by taking the
        // starting position (carouselRectangles.y) and add half of the height of the carousel to it.
        const y = Math.round(carouselRectangles.y + (carouselRectangles.height / 2));

        // Execute the gesture by providing a starting position and an end position
        Gestures.swipe(
            // Here we start on the left of the carousel. To make sure that we don't touch the outer most left
            // part of the screen we add 10% to the x-position. The y-position has already been determined.
            { x: Math.round(carouselRectangles.x + (carouselRectangles.width * 0.10)), y },
            // Here we end on the right of the carousel. To make sure that we don't touch the outer most right
            // part of the screen we take 10% of the x-position. The y-position has already been determined.
            { x: Math.round(carouselRectangles.width - (carouselRectangles.width * 0.10)), y },
        );
    }

    /**
     * Get the carousel position and size
     */
    getCarouselRectangles (): RectReturn {
        // Get the rectangles of the carousel and store it in a global that will be used for a next call.
        // We dont want ask for the rectangles of the carousel if we already know them.
        // This will save unneeded webdriver calls.
        CAROUSEL_RECTANGLES = CAROUSEL_RECTANGLES || driver.getElementRect($(SELECTORS.CAROUSEL).elementId);

        return CAROUSEL_RECTANGLES;
    }
}

export default new Carousel();
