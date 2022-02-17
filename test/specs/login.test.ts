import LoginScreen from  '../screenobjects/LoginScreen';
import OnboardingScreen from '../screenobjects/OnboardingScreen';
import NativeAlert from '../screenobjects/components/NativeAlert';
import CitiesScreen from '../screenobjects/CitiesScreen';
import HomeScreen from '../screenobjects/HomeScreen';

describe('Login on Zee now', () => {
    beforeEach(async () => {
        await OnboardingScreen.waitForIsShown(true);
        await OnboardingScreen.tapOnLoginButton();
        await LoginScreen.waitForIsShown(true);
    });

    it('should be able to login successfully', async () => {
        await LoginScreen.submitLogin({username: 'felipe.luz@zee-dog.com', password: 'abc123'});
        
        expect(await HomeScreen.waitForIsShown(true));
    });

    it('should not login with wrong credentials', async () => {
        await LoginScreen.submitLogin({username: 'test-@test.com', password: '123456'});
        expect(await NativeAlert.text()).toContain("E-mail ou senha inválidos.");
        
        //Close alert
        await NativeAlert.tapOnButtonWithText("OK");
    });

    it('should not retrieve password for emails not registered', async () => {
        const email = 'test@123.com';
        await LoginScreen.recoverPassword({email: email});

        expect(await NativeAlert.text()).toContain(`Não existe um usuário com o e-mail '${email}'.`);
        
        //Close alert
        await NativeAlert.tapOnButtonWithText("OK");
    });

    it('should open cities page to sign up', async () => {
        await LoginScreen.clickSignUpButton();
        
        await CitiesScreen.waitForIsShown(true);
    });

    it('should display error when email is invalid', async () => {
        await LoginScreen.submitLogin({username: '##--122333@@', password: 'abc123'});
        
        expect(await NativeAlert.componentText()).toContain('E-mail inválido');
    });

    it('should not login with blank inputs', async () => {
        await LoginScreen.submitLogin({username: '', password: ''});
        
        expect(await NativeAlert.componentText()).toContain('E-mail inválido');
        expect(await NativeAlert.componentText(1)).toContain('Campo não pode ser vazio');
    });

    it('should validate the e-mail to retrieve the password', async () => {
        //TODO
    });
    
    it('should avoid SQL injection', async () => {
        //TODO
    });

    it('should display error when theres no internet connection', async () => {
        //TODO
    });

    afterEach(async () => {
        await driver.reset();
    });
});


