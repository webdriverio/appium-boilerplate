import TabBar from '../screenobjects/components/TabBar.js';
import { NAV_TARGETS } from '../helpers/NavTargets.js';

/**
 * Tab-bar navigation spec.
 *
 * Verifies that each tab opens its target screen.  The list of targets is
 * shared with app.deep.link.navigation.spec.ts via NAV_TARGETS — only the
 * navigation trigger (TabBar.open*) differs between the two specs.
 */
const TAB_BAR_OPENERS: Record<string, () => Promise<void>> = {
    'webview':            () => TabBar.openWebView(),
    'login form screen':  () => TabBar.openLogin(),
    'forms screen':       () => TabBar.openForms(),
    'swipe screen':       () => TabBar.openSwipe(),
    'drag and drop screen': () => TabBar.openDrag(),
    'home screen':        () => TabBar.openHome(),
};

describe('WebdriverIO and Appium, when navigating through the tab bar', () => {
    beforeEach(async () => {
        await TabBar.waitForTabBarShown();
    });

    for (const target of NAV_TARGETS) {
        it(`should be able to open the ${target.name}`, async () => {
            await TAB_BAR_OPENERS[target.name]();
            await target.waitFor();
        });
    }
});
