import TabBar from '../screenobjects/components/TabBar';
import DragScreen from '../screenobjects/DragScreen';

describe('WebdriverIO and Appium, when using drag and drop', () => {
    beforeEach(() => {
        TabBar.waitForTabBarShown();
        TabBar.openDrag();
        DragScreen.waitForIsShown(true);
    });

    it('should be able to solve the puzzle by dragging the pieces into the puzzle', () => {
        // Drag each element to the position
        DragScreen.dragElementTo(DragScreen.dragL1, DragScreen.dropL1);
        DragScreen.dragElementTo(DragScreen.dragC1, DragScreen.dropC1);
        DragScreen.dragElementTo(DragScreen.dragR1, DragScreen.dropR1);
        DragScreen.dragElementTo(DragScreen.dragL2, DragScreen.dropL2);
        DragScreen.dragElementTo(DragScreen.dragC2, DragScreen.dropC2);
        DragScreen.dragElementTo(DragScreen.dragR2, DragScreen.dropR2);
        DragScreen.dragElementTo(DragScreen.dragL3, DragScreen.dropL3);
        DragScreen.dragElementTo(DragScreen.dragC3, DragScreen.dropC3);
        DragScreen.dragElementTo(DragScreen.dragR3, DragScreen.dropR3);

        // Wait for the retry button to be visible, meaning the success screen is there
        // There is no expectation here because the waitForDisplayed will fail if the element is not visible
        DragScreen.retry.waitForDisplayed();

        // Retry
        DragScreen.retry.click();
        // Wait for the renew button to be visible, meaning the puzzle is shown again
        // There is no expectation here because the waitForDisplayed will fail if the element is not visible
        DragScreen.renew.waitForDisplayed();
    });
});
