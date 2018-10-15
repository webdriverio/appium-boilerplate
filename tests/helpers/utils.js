const SELECTORS = {
    ANDROID: {
        TEXT: '*//android.widget.TextView',
        TEXT_FIELD: '*//android.widget.EditText',
    },
    IOS: {
        GENERIC_TEXT: null,
        XPATH_TEXT: '*//XCUIElementTypeStaticText',
        TEXT_FIELD: '*//XCUIElementTypeTextField',
    },
};

/**
 * Get the text of an element
 *  NOTE:
 *      This method will contain all the text of the component,
 *      including all the child components
 *
 * @param {element} element
 * @param {boolean} isXpath
 *
 * @return {string}
 */
export function getTextOfElement (element, isXpath = false) {
    let visualText;
    try {
        if (browser.isAndroid) {
            visualText = element.getText(SELECTORS.ANDROID.TEXT);
        } else {
            visualText = element.getText(isXpath ? SELECTORS.IOS.XPATH_TEXT : SELECTORS.IOS.GENERIC_TEXT);
        }
    } catch (e) {
        visualText = element.getText();
    }

    if (typeof visualText === 'string') {
        return visualText;
    }

    return Array.isArray(visualText) ? visualText.join(' ') : '';
}

/**
 * Get the time difference in seconds
 *
 * @param {number} start    the time in milliseconds
 * @param {number} end      the time in milliseconds
 */
export function timeDifference (start, end) {
    const elapsed = (end - start) / 1000;
    console.log('elapsed = ', elapsed, ' seconds');
}
