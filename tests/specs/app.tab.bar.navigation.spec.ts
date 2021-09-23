import TabBar from '../screenobjects/components/TabBar';
import WebViewScreen from '../screenobjects/WebviewScreen';
import LoginScreen from '../screenobjects/LoginScreen';
import FormsScreen from '../screenobjects/FormsScreen';
import SwipeScreen from '../screenobjects/SwipeScreen';
import HomeScreen from '../screenobjects/HomeScreen';
import DragScreen from '../screenobjects/DragScreen';

describe('WebdriverIO and Appium, when using navigation through the tab bar', () => {
    beforeEach(async () => {
        await TabBar.waitForTabBarShown();
    });

    it('should be able to open the webview', async () => {
        await TabBar.openWebView();
        await WebViewScreen.waitForWebsiteLoaded();
    });

    it('should be able to open the login form screen', async () => {
        await TabBar.openLogin();
        await LoginScreen.waitForIsShown(true);
    });

    it('should be able to open the forms screen', async () => {
        await TabBar.openForms();
        await FormsScreen.waitForIsShown(true);
    });

    it('should be able to open the swipe screen', async () => {
        await TabBar.openSwipe();
        await SwipeScreen.waitForIsShown(true);
    });

    it('should be able to open the drag and drop screen', async () => {
        await TabBar.openDrag();
        await DragScreen.waitForIsShown(true);
    });

    it('should be able to open the home screen', async () => {
        await TabBar.openHome();
        await HomeScreen.waitForIsShown(true);
    });
});
