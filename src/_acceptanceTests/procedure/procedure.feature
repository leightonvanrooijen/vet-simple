Feature: Vets can preform procedures
  @procedure
  Scenario: Vets finishes a procedure
    Given a vet begins a procedure
    When they finish
    Then the procedure will be finished
    And the customer will be billed