import LoginScreen from  '../pageobjects/LoginScreen';
import OnboardingScreen from '../pageobjects/OnboardingScreen';
import NativeAlert from '../pageobjects/components/NativeAlert';

describe('Login on Zee now', () => {
    describe('Login', () => {
        it('should not be able to login successfully', async () => {
            await OnboardingScreen.waitForIsShown(true);
            await OnboardingScreen.tapOnLoginButton();

            await LoginScreen.waitForIsShown(true);
            await LoginScreen.submitLogin({username: 'test-@test.com', password: '123456'});

            expect(await NativeAlert.text()).toContain("E-mail ou senha inválidos.");
            
            //Close alert
            await NativeAlert.topOnButtonWithText("OK");
        });

        it('should not retrieve password for emails not registered', async () => {
            const email = 'test@123.com';
            await OnboardingScreen.waitForIsShown(true);
            await OnboardingScreen.tapOnLoginButton();

            await LoginScreen.waitForIsShown(true);
            await LoginScreen.recoverPassword({email: email});

            expect(await NativeAlert.text()).toContain(`Não existe um usuário com o e-mail '${email}'.`);
            
            //Close alert
            await NativeAlert.topOnButtonWithText("OK");
        });

        it('should open addresses page to sign up', async () => {
            await OnboardingScreen.waitForIsShown(true);
            await OnboardingScreen.tapOnLoginButton();

            await LoginScreen.waitForIsShown(true);

            expect(await NativeAlert.text()).toContain(`Não existe um usuário com o e-mail '${email}'.`);
            
            //Close alert
            await NativeAlert.topOnButtonWithText("OK");
        });

        afterEach(async () => {
            await driver.reset();
        });
    });
});


