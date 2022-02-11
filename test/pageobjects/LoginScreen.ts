import AppScreen from './AppScreen';

class LoginScreen extends AppScreen {
    constructor () {
        super('android=className("android.widget.EditText").text("E-mail")');
    }

    private get email () {return $('android=className("android.widget.EditText").text("E-mail")');}
    private get password () {return $('android=className("android.widget.EditText").text("Senha")');}
    private get enterButton () {return $('android=className("android.widget.Button").text("ENTRAR")');}
    private get forgotPasswordButton () {return $('android=className("android.widget.TextView").text("Esqueci minha senha")');}
    private get signupButton () {return $('android=className("android.widget.TextView").text("NÃO TEM CONTA? CADASTRE-SE.")');}
    
    //private get errorMessage () {return $('android=className("android.widget.TextView").text("E-mail ou senha inválidos.")');}
    //private get dismissErrorMessageButton () {return $('android=className("android.widget.TextView").text("OK")');}

    async submitLogin ({ username, password }:{username:string; password:string;}) {
        await this.email.setValue(username);
        await this.password.setValue(password);

        await this.enterButton.click();
    }

    async clickForgotPasswordButton () {
        await this.forgotPasswordButton.click();
    }

    async clickSignUpButton () {
        await this.signupButton.click();
    }

    // async IsErrorMessageDisplayed ():Promise<boolean> {
    //     return await (await this.errorMessage).isDisplayed(); 
    // }
}

export default new LoginScreen();
