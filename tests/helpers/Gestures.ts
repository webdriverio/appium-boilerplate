import { RectReturn } from '@wdio/protocols/build/types';

/**
 * To make a Gesture methods more robust for multiple devices and also
 * multiple screen sizes the advice is to work with percentages instead of
 * actual coordinates. The percentages will calculate the position on the
 * screen based on the SCREEN_SIZE which will be determined once if needed
 * multiple times.
 */

let SCREEN_SIZE:RectReturn;
interface XY {
    x:number;
    y:number;
}

/**
 * The values in the below object are percentages of the screen
 */
const SWIPE_DIRECTION = {
    down: {
        start: { x: 50, y: 15 },
        end: { x: 50, y: 85 },
    },
    left: {
        start: { x: 95, y: 50 },
        end: { x: 5, y: 50 },
    },
    right: {
        start: { x: 5, y: 50 },
        end: { x: 95, y: 50 },
    },
    up: {
        start: { x: 50, y: 85 },
        end: { x: 50, y: 15 },
    },
};

class Gestures {
    /**
     * Check if an element is visible and if not wipe up a portion of the screen to
     * check if it visible after x amount of scrolls
     */
    static async checkIfDisplayedWithSwipeUp (element:WebdriverIO.Element, maxScrolls:number, amount = 0){
        // If the element is not displayed and we haven't scrolled the max amount of scrolls
        // then scroll and execute the method again
        if (!await element.isDisplayed() && amount <= maxScrolls) {
            await this.swipeUp(0.85);
            await this.checkIfDisplayedWithSwipeUp(element, maxScrolls, amount + 1);
        } else if (amount > maxScrolls) {
            // If the element is still not visible after the max amount of scroll let it fail
            throw new Error(`The element '${element}' could not be found or is not visible.`);
        }

        // The element was found, proceed with the next action
    }

    /**
     * Swipe down based on a percentage
     */
    static async swipeDown (percentage = 1) {
        await this.swipeOnPercentage(
            this.calculateXY(SWIPE_DIRECTION.down.start, percentage),
            this.calculateXY(SWIPE_DIRECTION.down.end, percentage),
        );
    }

    /**
     * Swipe Up based on a percentage
     */
    static async swipeUp (percentage = 1) {
        await this.swipeOnPercentage(
            this.calculateXY(SWIPE_DIRECTION.up.start, percentage),
            this.calculateXY(SWIPE_DIRECTION.up.end, percentage),
        );
    }

    /**
     * Swipe left based on a percentage
     */
    static async swipeLeft (percentage = 1) {
        await this.swipeOnPercentage(
            this.calculateXY(SWIPE_DIRECTION.left.start, percentage),
            this.calculateXY(SWIPE_DIRECTION.left.end, percentage),
        );
    }

    /**
     * Swipe right based on a percentage
     */
    static async swipeRight (percentage = 1) {
        await this.swipeOnPercentage(
            this.calculateXY(SWIPE_DIRECTION.right.start, percentage),
            this.calculateXY(SWIPE_DIRECTION.right.end, percentage),
        );
    }

    /**
     * Swipe from coordinates (from) to the new coordinates (to). The given coordinates are
     * percentages of the screen.
     */
    static async swipeOnPercentage (from: XY, to: XY) {
        // Get the screen size and store it so it can be re-used.
        // This will save a lot of webdriver calls if this methods is used multiple times.
        SCREEN_SIZE = SCREEN_SIZE || await driver.getWindowRect();
        // Get the start position on the screen for the swipe
        const pressOptions = this.getDeviceScreenCoordinates(SCREEN_SIZE, from);
        // Get the move to position on the screen for the swipe
        const moveToScreenCoordinates = this.getDeviceScreenCoordinates(SCREEN_SIZE, to);

        await this.swipe(
            pressOptions,
            moveToScreenCoordinates,
        );
    }

    /**
     * Swipe from coordinates (from) to the new coordinates (to). The given coordinates are in pixels.
     */
    static async swipe (from: XY, to: XY) {
        await driver.performActions([
            {
                // a. Create the event
                type: 'pointer',
                id: 'finger1',
                parameters: { pointerType: 'touch' },
                actions: [
                    // b. Move finger into start position
                    { type: 'pointerMove', duration: 0, x: from.x, y: from.y },
                    // c. Finger comes down into contact with screen
                    { type: 'pointerDown', button: 0 },
                    // d. Pause for a little bit
                    { type: 'pause', duration: 100 },
                    // e. Finger moves to end position
                    //    We move our finger from the center of the element to the
                    //    starting position of the element.
                    //    Play with the duration to make the swipe go slower / faster
                    { type: 'pointerMove', duration: 1000, x: to.x, y: to.y },
                    // f. Finger gets up, off the screen
                    { type: 'pointerUp', button: 0 },
                ],
            },
        ]);
        // Add a pause, just to make sure the swipe is done
        await driver.pause(1000);
    }

    /**
     * Get the screen coordinates based on a device his screen size
     */
    private static getDeviceScreenCoordinates (screenSize:RectReturn, coordinates: XY): XY {
        return {
            x: Math.round(screenSize.width * (coordinates.x / 100)),
            y: Math.round(screenSize.height * (coordinates.y / 100)),
        };
    }

    /**
     * Calculate the x y coordinates based on a percentage
     */
    private static calculateXY ({ x, y }:XY, percentage:number):XY {
        return {
            x: x * percentage,
            y: y * percentage,
        };
    }
}

export default Gestures;
