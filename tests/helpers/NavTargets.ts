/**
 * NAV_TARGETS — the canonical list of navigable screens in the demo app.
 *
 * Used by both navigation spec files (tab-bar and deep-link) to drive the
 * same 6 screens from a single source of truth.  Each entry defines:
 *
 *   - `name`    — human-readable label used in the `it` description
 *   - `deepLink`— the deep-link path passed to `openDeepLinkUrl()`
 *   - `waitFor` — async assertion that the target screen appeared
 *
 * Import this array and iterate over it — do not duplicate the target list.
 */

import WebViewScreen from '../screenobjects/WebviewScreen.js';
import LoginScreen from '../screenobjects/LoginScreen.js';
import FormsScreen from '../screenobjects/FormsScreen.js';
import SwipeScreen from '../screenobjects/SwipeScreen.js';
import HomeScreen from '../screenobjects/HomeScreen.js';
import DragScreen from '../screenobjects/DragScreen.js';

export interface NavTarget {
    /** Label for `it('should be able to open the …')` */
    name: string;
    /** Path segment passed to openDeepLinkUrl() */
    deepLink: string;
    /** Returns a promise that resolves when the screen is shown */
    waitFor: () => Promise<boolean | void>;
}

export const NAV_TARGETS: NavTarget[] = [
    {
        name:     'webview',
        deepLink: 'webview',
        waitFor:  () => WebViewScreen.waitForWebsiteLoaded(),
    },
    {
        name:     'login form screen',
        deepLink: 'login',
        waitFor:  () => LoginScreen.waitForIsShown(true),
    },
    {
        name:     'forms screen',
        deepLink: 'forms',
        waitFor:  () => FormsScreen.waitForIsShown(true),
    },
    {
        name:     'swipe screen',
        deepLink: 'swipe',
        waitFor:  () => SwipeScreen.waitForIsShown(true),
    },
    {
        name:     'drag and drop screen',
        deepLink: 'drag',
        waitFor:  () => DragScreen.waitForIsShown(true),
    },
    {
        name:     'home screen',
        deepLink: '',
        waitFor:  () => HomeScreen.waitForIsShown(true),
    },
];
