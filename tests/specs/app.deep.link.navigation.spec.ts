import TabBar from '../screenobjects/components/TabBar.js';
import { openDeepLinkUrl } from '../helpers/Utils.js';
import { NAV_TARGETS } from '../helpers/NavTargets.js';

/**
 * Deep-link navigation spec.
 *
 * Verifies that each deep link opens its target screen.  The list of targets
 * is shared with app.tab.bar.navigation.spec.ts via NAV_TARGETS — only the
 * navigation trigger (openDeepLinkUrl) differs between the two specs.
 */
describe('WebdriverIO and Appium, when navigating by deep link', () => {
    beforeEach(async () => {
        await TabBar.waitForTabBarShown();
    });

    for (const target of NAV_TARGETS) {
        it(`should be able to open the ${target.name}`, async () => {
            await openDeepLinkUrl(target.deepLink);
            await target.waitFor();
        });
    }
});
