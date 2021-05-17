import TabBar from '../screenobjects/components/TabBar';
import WebViewScreen from '../screenobjects/WebviewScreen';
import LoginScreen from '../screenobjects/LoginScreen';
import FormsScreen from '../screenobjects/FormsScreen';
import SwipeScreen from '../screenobjects/SwipeScreen';
import HomeScreen from '../screenobjects/HomeScreen';
import DragScreen from '../screenobjects/DragScreen';
import { openDeepLinkUrl } from '../helpers/Utils';

describe('WebdriverIO and Appium, when navigating by deep link', () => {
    beforeEach(() => {
        TabBar.waitForTabBarShown();
    });

    it('should be able to open the webview', () => {
        openDeepLinkUrl('webview');
        WebViewScreen.waitForWebsiteLoaded();
    });

    it('should be able to open the login form screen', () => {
        openDeepLinkUrl('login');
        LoginScreen.waitForIsShown(true);
    });

    it('should be able to open the forms screen', () => {
        openDeepLinkUrl('forms');
        FormsScreen.waitForIsShown(true);
    });

    it('should be able to open the swipe screen', () => {
        openDeepLinkUrl('swipe');
        SwipeScreen.waitForIsShown(true);
    });

    it('should be able to open the drag and drop screen', () => {
        openDeepLinkUrl('drag');
        DragScreen.waitForIsShown(true);
    });

    it('should be able to open the home screen', () => {
        openDeepLinkUrl('home');
        HomeScreen.waitForIsShown(true);
    });
});
