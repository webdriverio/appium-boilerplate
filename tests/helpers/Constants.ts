export const DEFAULT_PIN = 1234;
export const INCORRECT_PIN = 4321;
export const PACKAGE_NAME = 'com.wdiodemoapp';
export const BUNDLE_ID = 'org.wdiodemoapp';

/**
 * Centralised wait timeouts (milliseconds).
 * Use these instead of inline `N * 1000` literals so durations are
 * named, searchable, and changed in one place.
 */
export const TIMEOUTS = {
    /** 3 s — UiSelector fast-fail, short animation settle */
    VERY_SHORT: 3_000,
    /** 5 s — in-test polls: keyboard appear, alert tappable */
    QUICK: 5_000,
    /** 10 s — standard element-appears wait */
    SHORT:  10_000,
    /** 11 s — component-level waits (alert / picker) that need a small buffer above SHORT */
    SHORT_PLUS: 11_000,
    /** 15 s — PIN / confirmation-dialog prompts */
    MEDIUM: 15_000,
    /** 20 s — sensor prompt, webview connect */
    LONG:   20_000,
    /** 30 s — Android webview context switch */
    EXTRA_LONG: 30_000,
    /** 45 s — iOS webview context load */
    VERY_LONG: 45_000,
} as const;
