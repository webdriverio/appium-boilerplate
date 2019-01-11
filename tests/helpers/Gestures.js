let SCREEN_SIZE;
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
     * Check if an element is visible and if not scroll down a portion of the screen to
     * check if it visible after a x amount of scrolls
     *
     * @param {element} element
     * @param {number} maxScrolls
     * @param {number} amount
     */
    static checkIfDisplayedWithScrollDown (element, maxScrolls, amount = 0) {
        if ((!element.isExisting() || !element.isDisplayed()) && amount <= maxScrolls) {
            this.swipeUp(0.85);
            this.checkIfDisplayedWithScrollDown(element, maxScrolls, amount + 1);
        } else if (amount > maxScrolls) {
            throw new Error(`The element '${element}' could not be found or is not visible.`);
        }
    }

    /**
     * Swipe down based on a percentage
     *
     * @param {number} percentage from 0 - 1
     */
    static swipeDown (percentage = 1) {
        this.swipeOnPercentage(
            this._calculateXY(SWIPE_DIRECTION.down.start, percentage),
            this._calculateXY(SWIPE_DIRECTION.down.end, percentage),
        );
    }

    /**
     * Swipe Up based on a percentage
     *
     * @param {number} percentage from 0 - 1
     */
    static swipeUp (percentage = 1) {
        this.swipeOnPercentage(
            this._calculateXY(SWIPE_DIRECTION.up.start, percentage),
            this._calculateXY(SWIPE_DIRECTION.up.end, percentage),
        );
    }

    /**
     * Swipe left based on a percentage
     *
     * @param {number} percentage from 0 - 1
     */
    static swipeLeft (percentage = 1) {
        this.swipeOnPercentage(
            this._calculateXY(SWIPE_DIRECTION.left.start, percentage),
            this._calculateXY(SWIPE_DIRECTION.left.end, percentage),
        );
    }

    /**
     * Swipe right based on a percentage
     *
     * @param {number} percentage from 0 - 1
     */
    static swipeRight (percentage = 1) {
        this.swipeOnPercentage(
            this._calculateXY(SWIPE_DIRECTION.right.start, percentage),
            this._calculateXY(SWIPE_DIRECTION.right.end, percentage),
        );
    }

    /**
     * Swipe from coordinates (from) to the new coordinates (to). The given coordinates are
     * percentages of the screen.
     *
     * @param {object} from { x: 50, y: 50 }
     * @param {object} to { x: 25, y: 25 }
     *
     * @example
     * <pre>
     *   // This is a swipe to the left
     *   const from = { x: 50, y:50 }
     *   const to = { x: 25, y:50 }
     * </pre>
     */
    static swipeOnPercentage (from, to) {
        SCREEN_SIZE = SCREEN_SIZE || driver.getWindowRect();
        const pressOptions = this._getDeviceScreenCoordinates(SCREEN_SIZE, from);
        const moveToScreenCoordinates = this._getDeviceScreenCoordinates(SCREEN_SIZE, to);
        this.swipe(
            pressOptions,
            moveToScreenCoordinates,
        );
    }

    /**
     * Swipe from coordinates (from) to the new coordinates (to). The given coordinates are in pixels.
     *
     * @param {object} from { x: 50, y: 50 }
     * @param {object} to { x: 25, y: 25 }
     *
     * @example
     * <pre>
     *   // This is a swipe to the left
     *   const from = { x: 50, y:50 }
     *   const to = { x: 25, y:50 }
     * </pre>
     */
    static swipe (from, to) {
        driver.touchPerform([{
            action: 'press',
            options: from,
        }, {
            action: 'wait',
            options: { ms: 1000 },
        }, {
            action: 'moveTo',
            options: to,
        }, {
            action: 'release',
        }]);
        driver.pause(1000);
    }

    /**
     * Get the screen coordinates based on a device his screensize
     *
     * @param {number} screenSize the size of the screen
     * @param {object} coordinates like { x: 50, y: 50 }
     *
     * @return {{x: number, y: number}}
     *
     * @private
     */
    static _getDeviceScreenCoordinates (screenSize, coordinates) {
        return {
            x: Math.round(screenSize.width * (coordinates.x / 100)),
            y: Math.round(screenSize.height * (coordinates.y / 100)),
        };
    }

    /**
     * Calculate the x y coordinates based on a percentage
     *
     * @param {object} coordinates
     * @param {number} percentage
     *
     * @return {{x: number, y: number}}
     *
     * @private
     */
    static _calculateXY ({ x, y }, percentage) {
        return {
            x: x * percentage,
            y: y * percentage,
        };
    }
}

export default Gestures;
