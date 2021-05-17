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
    static checkIfDisplayedWithSwipeUp (element:WebdriverIO.Element, maxScrolls:number, amount = 0):void | Error {
        // If the element is not displayed and we haven't scrolled the max amount of scrolls
        // then scroll and execute the method again
        if (!element.isDisplayed() && amount <= maxScrolls) {
            this.swipeUp(0.85);
            this.checkIfDisplayedWithSwipeUp(element, maxScrolls, amount + 1);
        } else if (amount > maxScrolls) {
            // If the element is still not visible after the max amount of scroll let it fail
            throw new Error(`The element '${element}' could not be found or is not visible.`);
        }

        // The element was found, proceed with the next action
    }

    /**
     * Swipe down based on a percentage
     */
    static swipeDown (percentage = 1) {
        this.swipeOnPercentage(
            this.calculateXY(SWIPE_DIRECTION.down.start, percentage),
            this.calculateXY(SWIPE_DIRECTION.down.end, percentage),
        );
    }

    /**
     * Swipe Up based on a percentage
     */
    static swipeUp (percentage = 1) {
        this.swipeOnPercentage(
            this.calculateXY(SWIPE_DIRECTION.up.start, percentage),
            this.calculateXY(SWIPE_DIRECTION.up.end, percentage),
        );
    }

    /**
     * Swipe left based on a percentage
     */
    static swipeLeft (percentage = 1) {
        this.swipeOnPercentage(
            this.calculateXY(SWIPE_DIRECTION.left.start, percentage),
            this.calculateXY(SWIPE_DIRECTION.left.end, percentage),
        );
    }

    /**
     * Swipe right based on a percentage
     */
    static swipeRight (percentage = 1) {
        this.swipeOnPercentage(
            this.calculateXY(SWIPE_DIRECTION.right.start, percentage),
            this.calculateXY(SWIPE_DIRECTION.right.end, percentage),
        );
    }

    /**
     * Swipe from coordinates (from) to the new coordinates (to). The given coordinates are
     * percentages of the screen.
     */
    static swipeOnPercentage (from: XY, to: XY) {
        // Get the screen size and store it so it can be re-used.
        // This will save a lot of webdriver calls if this methods is used multiple times.
        SCREEN_SIZE = SCREEN_SIZE || driver.getWindowRect();
        // Get the start position on the screen for the swipe
        const pressOptions = this.getDeviceScreenCoordinates(SCREEN_SIZE, from);
        // Get the move to position on the screen for the swipe
        const moveToScreenCoordinates = this.getDeviceScreenCoordinates(SCREEN_SIZE, to);

        this.swipe(
            pressOptions,
            moveToScreenCoordinates,
        );
    }

    /**
     * Swipe from coordinates (from) to the new coordinates (to). The given coordinates are in pixels.
     */
    static swipe (from: XY, to: XY) {
        driver.touchPerform([
            // Press the 'finger' on the first location
            {
                action: 'press',
                options: from,
            },
            // This will be the swipe time
            {
                action: 'wait',
                options: { ms: 1000 },
            },
            // Move the finger to the second position where we want to release it
            {
                action: 'moveTo',
                options: to,
            },
            // Release it
            {
                action: 'release',
            },
        ]);
        // Add a pause, just to make sure the swipe is done
        driver.pause(1000);
    }

    /**
     * Get the screen coordinates based on a device his screen size
     */
    private static getDeviceScreenCoordinates (screenSize:RectReturn, coordinates: XY) {
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
