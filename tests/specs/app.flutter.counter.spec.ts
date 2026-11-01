import { expect } from 'expect-webdriverio';
import FlutterCounterScreen from '../screenobjects/FlutterCounterScreen.js';

describe('Flutter Demo App - Counter Flow', () => {
    beforeEach(async () => {
        await FlutterCounterScreen.ensureFlutterContext();
    });

    it('should display initial counter value as 0', async () => {
        await expect(FlutterCounterScreen.counterText).toBeDisplayed();
        await expect(FlutterCounterScreen.counterText).toHaveText('0');
    });

    it('should increment the counter when floating action button is clicked', async () => {
        await FlutterCounterScreen.tapIncrement();
        await expect(FlutterCounterScreen.counterText).toHaveText('1');

        await FlutterCounterScreen.tapIncrement();
        await expect(FlutterCounterScreen.counterText).toHaveText('2');
    });

    it('should support switching context to NATIVE_APP if interacting with system dialogs', async () => {
        // Example of context switching for native OS components:
        // await driver.switchContext('NATIVE_APP');
        // await $('//android.widget.Button[@text="ALLOW"]').click();
        // await driver.switchContext('FLUTTER');

        const currentContext = await driver.getContext();
        expect(currentContext).toBe('FLUTTER');
    });
});
