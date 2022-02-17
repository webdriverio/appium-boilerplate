import AppScreen from './AppScreen';

class HomeScreen extends AppScreen {
    constructor () {
        super('android=className("android.widget.TextView").text("O que você precisa?")');
    }

    private get cart () {return $('android=resourceId("br.com.zeenow.zeenow:id/home_cart_image")');}

    async clickOnCart () {
        await this.signupButton.click();
    }
}

export default new HomeScreen();
