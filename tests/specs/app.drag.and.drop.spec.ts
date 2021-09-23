import TabBar from '../screenobjects/components/TabBar';
import DragScreen from '../screenobjects/DragScreen';

describe('WebdriverIO and Appium, when using drag and drop', () => {
    beforeEach(async () => {
        await TabBar.waitForTabBarShown();
        await TabBar.openDrag();
        await DragScreen.waitForIsShown(true);
    });

    it('should be able to solve the puzzle by dragging the pieces into the puzzle', async () => {
        // Drag each element to the position
        await DragScreen.dragElementTo(await DragScreen.dragL1, await DragScreen.dropL1);
        await DragScreen.dragElementTo(await DragScreen.dragC1, await DragScreen.dropC1);
        await DragScreen.dragElementTo(await DragScreen.dragR1, await DragScreen.dropR1);
        await DragScreen.dragElementTo(await DragScreen.dragL2, await DragScreen.dropL2);
        await DragScreen.dragElementTo(await DragScreen.dragC2, await DragScreen.dropC2);
        await DragScreen.dragElementTo(await DragScreen.dragR2, await DragScreen.dropR2);
        await DragScreen.dragElementTo(await DragScreen.dragL3, await DragScreen.dropL3);
        await DragScreen.dragElementTo(await DragScreen.dragC3, await DragScreen.dropC3);
        await DragScreen.dragElementTo(await DragScreen.dragR3, await DragScreen.dropR3);

        // Wait for the retry button to be visible, meaning the success screen is there
        // There is no expectation here because the waitForDisplayed will fail if the element is not visible
        await DragScreen.waitForRetryButton();

        // Retry
        await DragScreen.tapOnRetryButton();
        // Wait for the renew button to be visible, meaning the puzzle is shown again
        // There is no expectation here because the waitForDisplayed will fail if the element is not visible
        await DragScreen.waitForRenewButton();
    });
});
