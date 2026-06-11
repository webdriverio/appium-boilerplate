import TabBar from '../screenobjects/components/TabBar.js';
import DragScreen from '../screenobjects/DragScreen.js';

describe('WebdriverIO and Appium, when using drag and drop', () => {
    beforeEach(async () => {
        await TabBar.waitForTabBarShown();
        await TabBar.openDrag();
        await DragScreen.waitForIsShown(true);
    });

    it('should be able to solve the puzzle by dragging the pieces into the puzzle', async () => {
        // Drag each element to the position, this uses the "new" `dragAndDrop` method that now also
        // supports native apps
        await DragScreen.dragL1.dragAndDrop(DragScreen.dropL1);
        await DragScreen.dragC1.dragAndDrop(DragScreen.dropC1);
        await DragScreen.dragR1.dragAndDrop(DragScreen.dropR1);
        await DragScreen.dragL2.dragAndDrop(DragScreen.dropL2);
        await DragScreen.dragC2.dragAndDrop(DragScreen.dropC2);
        await DragScreen.dragR2.dragAndDrop(DragScreen.dropR2);
        await DragScreen.dragL3.dragAndDrop(DragScreen.dropL3);
        await DragScreen.dragC3.dragAndDrop(DragScreen.dropC3);
        await DragScreen.dragR3.dragAndDrop(DragScreen.dropR3);

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
