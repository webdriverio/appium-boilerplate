import { DEFAULT_PIN, TIMEOUTS } from '../helpers/Constants.js';

/** Minimum Android API levels at which each enrollment UI path first appeared. */
const ANDROID_VERSION = {
    ANDROID_10: 10,
    ANDROID_12: 12,
    ANDROID_14: 14,
    ANDROID_16: 16,
} as const;

const SELECTORS = {
    // Settings-app elements have no accessibility IDs, so UiAutomator2 text/description
    // matching is the most stable strategy available here.
    DISMISS_BY_DESCRIPTION: 'android=new UiSelector().descriptionContains("Dismiss")',
    DISMISS_BY_TEXT: 'android=new UiSelector().textMatches("(?i)Dismiss")',
    /** Case-insensitive regex text match — Settings labels vary across Android versions. */
    byTextPattern: (pattern: string) => `android=new UiSelector().textMatches("(?i)${pattern}")`,
} as const;

class AndroidSettings {
    /**
     * Get the numeric Android platform version from the active session capabilities.
     */
    private get platformVersion(): number {
        return parseInt(
            ('platformVersion' in driver.capabilities ? driver.capabilities['platformVersion'] : '9') as string,
            10,
        );
    }

    // ── Public API ────────────────────────────────────────────────────────────

    /**
     * Walk through all steps to enable fingerprint biometrics, from Android 9 (2018)
     * to the latest version, fully automatically.
     */
    async enableBiometricLogin() {
        // --activity-clear-task forces the Settings app to start fresh on the Security &
        // Privacy root screen even when a sub-screen (e.g. Account security) is already
        // in the foreground from a previous test step.
        await this.executeAdbCommand('am start --activity-clear-task -a android.settings.SECURITY_SETTINGS');
        await this.ensurePinIsSet();

        if (this.platformVersion >= ANDROID_VERSION.ANDROID_16) {
            await this.navigateToFingerprintAndroid16();
        } else if (this.platformVersion >= ANDROID_VERSION.ANDROID_14) {
            await this.navigateToFingerprintAndroid14();
        } else {
            await this.waitAndTap('.*Fingerprint.*');
        }

        await this.fingerPrintWizard(DEFAULT_PIN);
    }

    /**
     * Find an Android element by a text pattern (case-insensitive regex match).
     * Returns a ChainablePromiseElement directly — no await needed at the call site.
     */
    findAndroidElementByMatchingText(pattern: string) {
        return $(SELECTORS.byTextPattern(pattern));
    }

    /**
     * Wait for an element matching `pattern` to be displayed.
     */
    async waitForMatchingElement(pattern: string) {
        await this.findAndroidElementByMatchingText(pattern).waitForDisplayed({
            timeout: TIMEOUTS.SHORT,
            timeoutMsg: `Element matching "${pattern}" not shown within ${TIMEOUTS.SHORT / 1000}s`,
        });
    }

    /**
     * Resolve the matching element once, wait for it, then click.
     * Resolving once prevents the race where the element disappears between
     * the waitForDisplayed call and a second findElement lookup.
     */
    async waitAndTap(pattern: string) {
        const element = this.findAndroidElementByMatchingText(pattern);
        await element.waitForDisplayed({
            timeout: TIMEOUTS.SHORT,
            timeoutMsg: `Element matching "${pattern}" not shown within ${TIMEOUTS.SHORT / 1000}s`,
        });
        await element.click();
    }

    // ── Navigation helpers (version-specific paths into fingerprint setup) ────

    /**
     * Android 16: after a fingerprint is already enrolled the OS shows a "Fingerprint"
     * shortcut directly on the Security & Privacy screen.  On a fresh/wiped device
     * (no fingerprint enrolled yet) that shortcut is absent and the entry point is
     * "Device unlock" instead — the same path used by Android 14/15.
     * Try the direct shortcut first; fall back to "Device unlock" if it isn't there.
     */
    private async navigateToFingerprintAndroid16() {
        const fingerprintVisible = await this.findAndroidElementByMatchingText('Fingerprint|Pixel Imprint')
            .isDisplayed()
            .catch(() => false);

        if (!fingerprintVisible) {
            // "Device unlock" may be below the fold — scroll down until it is visible,
            // then tap it to reach the fingerprint sub-screen.
            await driver.waitUntil(
                async () => {
                    const el = this.findAndroidElementByMatchingText('Device unlock.*');
                    if (await el.isDisplayed().catch(() => false)) return true;
                    await driver.execute('mobile: scroll', { direction: 'down', percent: 0.5 });
                    return false;
                },
                { timeout: TIMEOUTS.MEDIUM, timeoutMsg: '"Device unlock" not found after scrolling Security & Privacy' },
            );
            await this.waitAndTap('Device unlock.*');
        }

        await this.closeSettingsScreenLockNotifications();
        await this.waitAndTap('Fingerprint|Pixel Imprint');
        await this.reEnterPin(DEFAULT_PIN);
        await this.waitAndTap('MORE');
        await this.waitAndTap('I AGREE');
    }

    /** Android 14/15: Fingerprint lives under "Device unlock & biometrics". */
    private async navigateToFingerprintAndroid14() {
        await this.waitForMatchingElement('Device unlock.*');
        await this.closeSettingsScreenLockNotifications();
        await this.waitAndTap('Device unlock.*');
        await this.waitAndTap('.*Fingerprint.*');
    }

    // ── Enrollment wizard steps ───────────────────────────────────────────────

    /**
     * Run the correct enrollment wizard flow for the current platform version.
     */
    private async fingerPrintWizard(pin: number) {
        if (this.platformVersion >= ANDROID_VERSION.ANDROID_10) {
            await this.postAndroidTenFingerPrintSetup(pin);
        } else {
            await this.preAndroidTenFingerPrintSetup(pin);
        }
        await this.touchFingerPrintSensor(pin);
        await this.waitAndTap('DONE');
    }

    /** Pre-Android 10 setup: NEXT → re-enter PIN. */
    private async preAndroidTenFingerPrintSetup(pin: number) {
        await this.waitAndTap('NEXT');
        await this.reEnterPin(pin);
    }

    /** Android 10–15 setup: re-enter PIN, accept T&C based on version. */
    private async postAndroidTenFingerPrintSetup(pin: number) {
        // The platformVersion >= 16 guard here intentionally mirrors the routing
        // in fingerPrintWizard. The caller reaches this method only for versions >= 10,
        // but Android 16 already completed PIN + T&C in navigateToFingerprintAndroid16(),
        // so we exit early to skip the redundant steps.  Keeping the guard in both
        // layers avoids a silent regression if callers are refactored independently.
        if (this.platformVersion >= ANDROID_VERSION.ANDROID_16) {
            return;
        }
        await this.reEnterPin(pin);
        if (this.platformVersion >= ANDROID_VERSION.ANDROID_14) {
            await this.waitAndTap('Pixel Imprint|.*Fingerprint.*');
            await this.waitAndTap('MORE');
            await this.waitAndTap('I AGREE');
        } else if (this.platformVersion >= ANDROID_VERSION.ANDROID_12) {
            await this.waitAndTap('MORE');
            await this.waitAndTap('I AGREE');
        } else {
            await this.waitAndTap('NEXT');
        }
    }

    /** Wait for the PIN-entry screen then submit the PIN via ADB. */
    private async reEnterPin(pin: number) {
        await this.findAndroidElementByMatchingText(
            'Enter your device PIN|Re-enter your PIN|Confirm your PIN|Enter your PIN',
        ).waitForDisplayed({
            timeout: TIMEOUTS.MEDIUM,
            timeoutMsg: `PIN confirmation prompt not shown within ${TIMEOUTS.MEDIUM / 1000}s`,
        });
        await this.executeAdbCommand(`input text ${pin} && input keyevent 66`);
    }

    // ── Sensor touch steps ────────────────────────────────────────────────────

    /**
     * Simulate the required finger touches to complete fingerprint enrollment.
     * The number of touches and prompt text differ by Android version.
     */
    private async touchFingerPrintSensor(touchCode: number) {
        if (this.platformVersion >= ANDROID_VERSION.ANDROID_16) {
            await this.touchSensorAndroid16(touchCode);
        } else {
            await this.touchSensorLegacy(touchCode);
        }
    }

    /** Android 16 requires exactly 3 touches with specific prompt progression. */
    private async touchSensorAndroid16(touchCode: number) {
        await this.waitForPromptAndTouch('Touch the sensor', touchCode, TIMEOUTS.LONG);
        await this.waitForPromptAndTouch('Lift, then touch again', touchCode, TIMEOUTS.SHORT);
        await this.waitForPromptAndTouch('Lift finger, then touch sensor again', touchCode, TIMEOUTS.SHORT);
        await this.findAndroidElementByMatchingText('Fingerprint added').waitForDisplayed({
            timeout: TIMEOUTS.MEDIUM,
            timeoutMsg: `Fingerprint added confirmation not shown within ${TIMEOUTS.MEDIUM / 1000}s`,
        });
    }

    /** Pre-Android-16 enrollment: three separate prompt/touch pairs. */
    private async touchSensorLegacy(touchCode: number) {
        await this.waitForPromptAndTouch('Touch the sensor.*|Lift, then touch.*', touchCode, TIMEOUTS.LONG);
        await this.waitForPromptAndTouch('Put your finger.*', touchCode, TIMEOUTS.SHORT);
        await this.waitForPromptAndTouch('Keep lifting.*', touchCode, TIMEOUTS.SHORT);
    }

    /** Wait for a sensor-prompt element and immediately simulate a finger touch. */
    private async waitForPromptAndTouch(promptPattern: string, touchCode: number, timeout: number) {
        await this.findAndroidElementByMatchingText(promptPattern).waitForDisplayed({
            timeout,
            timeoutMsg: `Sensor prompt "${promptPattern}" not shown within ${timeout / 1000}s`,
        });
        await driver.fingerPrint(touchCode);
    }

    // ── Utility helpers ───────────────────────────────────────────────────────

    /** Set PIN on a fresh emulator; re-use the same PIN on a previously set emulator. */
    private async ensurePinIsSet() {
        try {
            await this.executeAdbCommand(`locksettings set-pin ${DEFAULT_PIN}`);
        } catch {
            await this.executeAdbCommand(`locksettings set-pin --old ${DEFAULT_PIN} ${DEFAULT_PIN}`);
        }
    }

    /** Close any "Set screen lock" notification that blocks the fingerprint setting. */
    private async closeSettingsScreenLockNotifications() {
        try {
            if (await this.findAndroidElementByMatchingText('Set screen lock').isDisplayed()) {
                const byDesc = $(SELECTORS.DISMISS_BY_DESCRIPTION);
                await byDesc.click();
                // A second dismiss button (matched by text) may exist on some ROMs; only tap
                // it if still visible after the first click to avoid a stale-element throw.
                const byText = $(SELECTORS.DISMISS_BY_TEXT);
                if (await byText.isDisplayed()) {
                    await byText.click();
                }
            }
        } catch { /* notification not present — safe to ignore */ }
    }

    /** Run an ADB shell command via the Appium mobile:shell extension. */
    private async executeAdbCommand(adbCommand: string) {
        await driver.execute('mobile: shell', { command: adbCommand });
    }
}

export default new AndroidSettings();
