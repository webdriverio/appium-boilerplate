import AppScreen from './AppScreen';

class LoginScreen extends AppScreen {
    constructor () {
        super('android=className("android.widget.EditText").text("E-mail")');
    }

    private get email () {return $('android=className("android.widget.EditText").text("E-mail")');}
    private get password () {return $('android=className("android.widget.EditText").text("Senha")');}
    private get enterButton () {return $('android=className("android.widget.Button").text("ENTRAR")');}
    private get forgotPasswordButton () {return $('android=className("android.widget.TextView").text("Esqueci minha senha")');}
    private get emailToRecoverPassword () {return $('android=className("android.widget.EditText").text("E-mail")');}
    private get sendEmailToRecoverPasswordButton () {return $('android=resourceId("br.com.zeenow.zeenow:id/custom_modal_button").text("ENVIAR")');}
    private get signupButton () {return $('android=className("android.widget.TextView").text("NÃO TEM CONTA? CADASTRE-SE.")');}

    async submitLogin ({ username, password }:{username:string; password:string;}) {
        await this.email.setValue(username);
        await this.password.setValue(password);

        await this.enterButton.click();
    }

    async clickSignUpButton () {
        await this.signupButton.click();
    }

    async recoverPassword( { email }:{ email:string;}) {
        await this.forgotPasswordButton.click();
        await (await this.emailToRecoverPassword).setValue(email);
        await this.sendEmailToRecoverPasswordButton.click();
    }
}

export default new LoginScreen();
