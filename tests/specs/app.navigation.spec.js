import TabBar from '../screenobjects/components/tab.bar';
import WebViewScreen from '../screenobjects/webview.screen';
import LoginScreen from '../screenobjects/login.screen';
import FormsScreen from '../screenobjects/forms.screen';
import SwipeScreen from '../screenobjects/swipe.screen';
import HomeScreen from '../screenobjects/home.screen';

describe('WebdriverIO and Appium', () => {
    beforeEach(() => {
        TabBar.waitForTabBarShown(true);
    });

    it('should be able to open the webview', () => {
        TabBar.openWebView();
        WebViewScreen.waitForWebsiteLoaded();
    });

    it('should be able to open the login form screen', () => {
        TabBar.openLogin();
        LoginScreen.waitForIsShown(true);
    });

    it('should be able to open the forms screen', () => {
        TabBar.openForms();
        FormsScreen.waitForIsShown(true);
    });

    it('should be able to open the swipe screen', () => {
        TabBar.openSwipe();
        SwipeScreen.waitForIsShown(true);
    });

    it('should be able to open the home screen', () => {
        TabBar.openHome();
        HomeScreen.waitForIsShown(true);
    });
});
