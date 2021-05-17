import TabBar from '../screenobjects/components/TabBar';
import WebViewScreen from '../screenobjects/WebviewScreen';
import LoginScreen from '../screenobjects/LoginScreen';
import FormsScreen from '../screenobjects/FormsScreen';
import SwipeScreen from '../screenobjects/SwipeScreen';
import HomeScreen from '../screenobjects/HomeScreen';
import DragScreen from '../screenobjects/DragScreen';

describe('WebdriverIO and Appium, when using navigation through the tab bar', () => {
    beforeEach(() => {
        TabBar.waitForTabBarShown();
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

    it('should be able to open the drag and drop screen', () => {
        TabBar.openDrag();
        DragScreen.waitForIsShown(true);
    });

    it('should be able to open the home screen', () => {
        TabBar.openHome();
        HomeScreen.waitForIsShown(true);
    });
});
