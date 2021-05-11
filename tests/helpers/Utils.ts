const SELECTORS = {
    ANDROID: {
        TEXT: '*//android.widget.TextView',
        TEXT_FIELD: '*//android.widget.EditText',
    },
    IOS: {
        GENERIC_TEXT: null,
        TEXT_ELEMENT: '-ios predicate string:type == \'XCUIElementTypeStaticText\'',
    },
};

/**
 * Get the text of an element (including all child elements)
 */
export function getTextOfElement (element: WebdriverIO.Element, isXpath = false):string {
    let visualText;

    try {
        if (driver.isAndroid) {
            visualText = element.$$(SELECTORS.ANDROID.TEXT).reduce((currentValue, el) => `${currentValue} ${el.getText()}`, '');
        } else {
            const iosElement:WebdriverIO.Element | WebdriverIO.ElementArray = isXpath ? element.$$(SELECTORS.IOS.TEXT_ELEMENT) : element;

            if (isXpath) {
                visualText = element.$$(SELECTORS.IOS.TEXT_ELEMENT).reduce((currentValue, el) => `${currentValue} ${el.getText()}`, '');
            } else {
                visualText = iosElement.getText();
            }
        }
    } catch (e) {
        // If nothing works then we have a fallback that will just get the text from the provided
        // element. This could not be the correct value, but better a value then completely nothing.
        visualText = element.getText();
    }

    return visualText.trim();
}

/**
 * Get the time difference in seconds
 */
export function timeDifference (start:number, end:number):void {
    const elapsed = (end - start) / 1000;
    console.log('elapsed = ', elapsed, ' seconds');
}

/**
 * Create a cross platform solution for opening a deep link
 */
export function openDeepLinkUrl(url:string):void {
    const prefix = 'wdio://';

    if (driver.isAndroid) {
        // Life is so much easier
        return driver.execute('mobile:deepLink', {
            url: `${ prefix }${ url }`,
            package: 'com.wdiodemoapp',
        });
    }

    // Launch Safari to open the deep link
    driver.execute('mobile: launchApp', { bundleId: 'com.apple.mobilesafari' });

    // Add the deep link url in Safari in the `URL`-field
    // This can be 2 different elements, or the button, or the text field
    // Use the predicate string because  the accessibility label will return 2 different types
    // of elements making it flaky to use. With predicate string we can be more precise
    const urlButtonSelector = 'type == \'XCUIElementTypeButton\' && name CONTAINS \'URL\'';
    const urlFieldSelector = 'type == \'XCUIElementTypeTextField\' && name CONTAINS \'URL\'';
    const urlButton = $(`-ios predicate string:${ urlButtonSelector }`);
    const urlField = $(`-ios predicate string:${ urlFieldSelector }`);

    // Wait for the url button to appear and click on it so the text field will appear
    // iOS 13 now has the keyboard open by default because the URL field has focus when opening the Safari browser
    if (!driver.isKeyboardShown()) {
        urlButton.waitForDisplayed();
        urlButton.click();
    }

    // Submit the url and add a break
    urlField.setValue(`${ prefix }${ url }\uE007`);

    /**
     * PRO TIP:
     * if you started the iOS device with `autoAcceptAlerts:true` in the capabilities then Appium will auto accept the alert that should
     * be shown now. You can then comment out the code below
     */
    // Wait for the notification and accept it
    try {
        const openSelector = 'type == \'XCUIElementTypeButton\' && name CONTAINS \'Open\'';
        const openButton = $(`-ios predicate string:${ openSelector }`);
        openButton.waitForDisplayed();
        openButton.click();
    } catch (e) {
        // ignore
    }
}

