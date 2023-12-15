import TabBar from '../screenobjects/components/TabBar.js';
import WebViewScreen from '../screenobjects/WebviewScreen.js';
import LoginScreen from '../screenobjects/LoginScreen.js';
import FormsScreen from '../screenobjects/FormsScreen.js';
import SwipeScreen from '../screenobjects/SwipeScreen.js';
import HomeScreen from '../screenobjects/HomeScreen.js';
import DragScreen from '../screenobjects/DragScreen.js';
import { openDeepLinkUrl } from '../helpers/Utils.js';

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
