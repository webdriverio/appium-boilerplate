export default class AppScreen {
    private selector: string;

    constructor (selector: string) {
        this.selector = selector;
    }

    /**
     * Wait for a screen to be visible
     *
     * @param {boolean} isShown
     */
    async waitForIsShown (isShown = true): Promise<boolean | void> {
        return $(this.selector).waitForDisplayed({
            reverse: !isShown,
        });
    }

    /**
     * Search for a location using the text input value
     */
    async searchForLocation (location: string, value:string, output:string) {
        let selector: string;

        // Location: City or Region
        location.toLowerCase() == "city"
            ? SELECTORS.ANDROID.SEARCH_INPUT_LOCATION + '/cities_search_field")'
            : SELECTORS.ANDROID.SEARCH_INPUT_LOCATION + '/regions_search_field")'

        // Insert a text to search
        $(selector).setValue(value);

        // Select the output
        //selector =  SELECTORS.ANDROID.SEARCH_INPUT_LOCATION + `.text("${output}")')`;
        $(selector).click();
    }
}
