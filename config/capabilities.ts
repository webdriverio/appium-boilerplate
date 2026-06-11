/**
 * Shared Appium capability builders.
 *
 * Each config file calls one of these factories to construct its capability
 * object, ensuring a single source of truth for common settings.  Only
 * device-specific values (name, UDID, WDA port, app version, …) are passed
 * as arguments.
 */
import { join } from 'node:path';

// ── App paths ─────────────────────────────────────────────────────────────────

const APP_DIR = join(process.cwd(), 'apps');

export const APPS = {
    ANDROID: join(APP_DIR, 'android.wdio.native.app.v2.2.0.apk'),
    IOS:     join(APP_DIR, 'ios.simulator.wdio.native.app.v2.2.0.zip'),
} as const;

// ── Android ───────────────────────────────────────────────────────────────────

export interface AndroidDeviceOptions {
    /** AVD name (must match the emulator AVD name exactly). */
    deviceName: string;
    /** ADB serial returned by `adb devices` (e.g. "emulator-5558"). */
    udid: string;
    platformVersion?: string;
}

/**
 * Return the W3C capability block for an Android emulator running UiAutomator2.
 *
 * Settings shared across all Android configurations are defined here.
 * Override individual keys in the per-device config if needed.
 */
export function androidCapabilities(device: AndroidDeviceOptions): WebdriverIO.Capabilities {
    return {
        platformName: 'Android',
        'wdio:maxInstances': 1,
        'appium:deviceName': device.deviceName,
        'appium:udid': device.udid,
        'appium:platformVersion': device.platformVersion ?? '16.0',
        'appium:orientation': 'PORTRAIT',
        'appium:automationName': 'UiAutomator2',
        'appium:app': APPS.ANDROID,
        'appium:appWaitActivity': 'com.wdiodemoapp.MainActivity',
        'appium:newCommandTimeout': 240,
        'appium:autoGrantPermissions': true,
        'appium:noReset': false,
    };
}

// ── iOS ───────────────────────────────────────────────────────────────────────

export interface IosDeviceOptions {
    /** Simulator display name. */
    deviceName: string;
    /** Simulator UDID from `xcrun simctl list`. */
    udid: string;
    platformVersion: string;
    /**
     * WDA local port — must differ per concurrent iOS session on the same host.
     * Primary: 8100 / Secondary: 8101.
     */
    wdaLocalPort: number;
}

/**
 * Return the W3C capability block for an iOS Simulator running XCUITest.
 *
 * Settings shared across all iOS configurations are defined here.
 */
export function iosCapabilities(device: IosDeviceOptions): WebdriverIO.Capabilities {
    return {
        platformName: 'iOS',
        'wdio:maxInstances': 1,
        'appium:deviceName': device.deviceName,
        'appium:udid': device.udid,
        'appium:platformVersion': device.platformVersion,
        'appium:orientation': 'PORTRAIT',
        'appium:automationName': 'XCUITest',
        'appium:app': APPS.IOS,
        'appium:newCommandTimeout': 240,
        // Pin WDA to a fixed port so concurrent ios.app2 runs don't collide.
        'appium:wdaLocalPort': device.wdaLocalPort,
        // Enroll Touch ID/Face ID before the app launches so biometric
        // availability is detected on the very first render.
        'appium:allowTouchIdEnroll': true,
        // Webview detection for iOS 18.x — wildcard matches all webview processes.
        'appium:webviewConnectTimeout': 20_000,
        'appium:additionalWebviewBundleIds': ['*'],
        // Slow down typing to avoid missed key-strokes on simulators.
        'appium:maxTypingFrequency': 30,
        'appium:noReset': false,
    } as WebdriverIO.Capabilities;
}

// ── Appium service helper ─────────────────────────────────────────────────────

/**
 * Build the Appium service config for a given port and log file.
 * Pass `port: undefined` to use Appium's default port (4723).
 */
export function appiumService(opts: { port?: number; logFile: string }): [string, object] {
    return [
        'appium',
        {
            args: {
                relaxedSecurity: true,
                log: opts.logFile,
                ...(opts.port !== undefined ? { port: opts.port } : {}),
            },
        },
    ];
}
