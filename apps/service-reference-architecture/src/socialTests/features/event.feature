Feature: Manage events

    As an application
    I want to persist events
    So that I can provide an audit trail of changes to provide troubleshooting assistance when failures occur

    @social
    Scenario Outline: Create and retrieve event
        Given I create an event with <name> and <description>
        When I get that event
        Then It still has <name> and <description>
        Examples:
            | name   | description    |
            | event1 | this is event1 |
