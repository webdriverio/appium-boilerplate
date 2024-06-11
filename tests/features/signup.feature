Feature: Signup

    Scenario: Successful Signup
        Given I am on the signup tab
        When I enter valid signup credentials
        Then I should see a Signed Up alert
        And the alert should be closed when I click on OK
