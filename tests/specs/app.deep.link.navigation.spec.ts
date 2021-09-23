import TabBar from '../screenobjects/components/TabBar';
import WebViewScreen from '../screenobjects/WebviewScreen';
import LoginScreen from '../screenobjects/LoginScreen';
import FormsScreen from '../screenobjects/FormsScreen';
import SwipeScreen from '../screenobjects/SwipeScreen';
import HomeScreen from '../screenobjects/HomeScreen';
import DragScreen from '../screenobjects/DragScreen';
import { openDeepLinkUrl } from '../helpers/Utils';

describe('WebdriverIO and Appium, when navigating by deep link', () => {
    beforeEach(async () => {
        await TabBar.waitForTabBarShown();
    });

    it('should be able to open the webview', async () => {
        await openDeepLinkUrl('webview');
        await WebViewScreen.waitForWebsiteLoaded();
    });

    it('should be able to open the login form screen', async () => {
        await openDeepLinkUrl('login');
        await LoginScreen.waitForIsShown(true);
    });

    it('should be able to open the forms screen', async () => {
        await openDeepLinkUrl('forms');
        await FormsScreen.waitForIsShown(true);
    });

    it('should be able to open the swipe screen', async () => {
        await openDeepLinkUrl('swipe');
        await SwipeScreen.waitForIsShown(true);
    });

    it('should be able to open the drag and drop screen', async () => {
        await openDeepLinkUrl('drag');
        await DragScreen.waitForIsShown(true);
    });

    it('should be able to open the home screen', async () => {
        await openDeepLinkUrl('home');
        await HomeScreen.waitForIsShown(true);
    });
});
