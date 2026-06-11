/**
 * BaseScreen — the common ancestor for all screen objects (native and web).
 *
 * Holds the contract for `waitForIsShown` and the shared `dismissKeyboard`
 * helper so neither native `AppScreen` nor web `Page` needs to duplicate them.
 */
export default abstract class BaseScreen {
    /**
     * Wait for this screen to be shown or hidden.
     * Subclasses override this to target the most reliable visible element.
     */
    abstract waitForIsShown(isShown?: boolean): Promise<boolean | void>;

    /**
     * Dismiss the on-screen keyboard if it is currently shown.
     *
     * `driver.hideKeyboard()` throws on iOS (XCTest limitation:
     * "The keyboard on iPhone cannot be dismissed because of a known XCTest issue.").
     * The fallback taps a supplied element to dismiss the keyboard through the UI.
     *
     * @param fallback — a clickable element to tap when hideKeyboard() is unavailable (required on iOS).
     *                   Accepts both resolved elements and WDIO chainable element proxies from `$()`.
     */
    protected async dismissKeyboard(fallback?: { click: () => Promise<void> }): Promise<void> {
        if (!await driver.isKeyboardShown()) return;
        try {
            await driver.hideKeyboard();
        } catch {
            // iOS XCTest cannot dismiss the keyboard programmatically.
            // Tap the supplied fallback element to dismiss through the UI.
            if (fallback) {
                await fallback.click();
            }
        }
    }
}
