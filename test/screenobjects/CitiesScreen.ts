import AppScreen from './AppScreen';

class CitiesScreen extends AppScreen {
    constructor () {
        super('android=resourceId("br.com.zeenow.zeenow:id/cities_title")');
    }
    
    private get search () {return $('android=resourceId("br.com.zeenow.zeenow:id/cities_search_field")');}
    private get selectCity () {return $('android=resourceId("br.com.zeenow.zeenow:id/city_region_title")');}

    /**
     * Search for a location using the text input value
     */
    static async searchForLocation (location: string, value:string, output:string) {
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

export default new CitiesScreen;
