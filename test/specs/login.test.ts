import LoginScreen from  '../pageobjects/LoginScreen';
import OnboardingScreen from '../pageobjects/OnboardingScreen';
import NativeAlert from '../pageobjects/components/NativeAlert';

describe('Login on Zee now', () => {
    it('should not be able to login successfully', async () => {
        await OnboardingScreen.waitForIsShown(true);
        await OnboardingScreen.tapOnLoginButton();

        await LoginScreen.waitForIsShown(true);
        await LoginScreen.submitLogin({username: 'test-@test.com', password: '123456'});

        expect(await NativeAlert.text()).toContain("E-mail ou senha inválidos.");

    });
});


