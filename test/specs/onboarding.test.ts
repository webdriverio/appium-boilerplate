import LoginScreen from  '../screenobjects/LoginScreen';
import OnboardingScreen from '../screenobjects/OnboardingScreen';
import NativeAlert from '../screenobjects/components/NativeAlert';
import CitiesScreen from '../screenobjects/CitiesScreen';
import HomeScreen from '../screenobjects/HomeScreen';

describe('Login on Zee now', () => {
    beforeEach(async () => {
        await OnboardingScreen.waitForIsShown(true);
        
    });

    it('should open login page', async () => {
        await OnboardingScreen.tapOnLoginButton();
        await LoginScreen.waitForIsShown(true);
    });

    it('should open cities page', async () => {
        await OnboardingScreen.tapOnStartButton();
        await LoginScreen.waitForIsShown(true);
    });

    it('should open forgot password', async () => {
        await OnboardingScreen.tapOnStartButton();
        await LoginScreen.waitForIsShown(true);
    });
});

    