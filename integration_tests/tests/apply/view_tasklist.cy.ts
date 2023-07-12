//  Feature: Referrer views tasklist
//    So that I can access the individual tasks in the application journey
//    As a referrer
//    I want to view a list of form tasks, grouped into sections

//  Scenario: Sees link to task within its section
//    Given there is a section with a task
//    And I am logged in
//    When I create an application
//    Then I should see the task listed within the section
//    And the task should link to its first page
//    And the task list page should have the expected question

import IndexPage from '../../pages'
import { personFactory, applicationFactory } from '../../../server/testutils/factories/index'

context('New', () => {
  const person = personFactory.build({})
  const application = applicationFactory.build({})

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
  })

  beforeEach(() => {
    // Given I am logged in
    //---------------------
    cy.signIn()
    cy.task('stubApplications', [])

    // When I create an application
    //------------------------------

    //  visit the start page
    IndexPage.visit()

    //  click on the start button
    cy.get('[role="button"]').click()

    //  search for a CRN
    cy.task('stubFindPerson', {
      person,
    })
    cy.task('stubCreateApplication', { application })
    cy.task('stubApplicationGet', { application })
    cy.get('#crn').type(person.crn)
    cy.get('button').contains('Save and continue').click()
  })

  // Then I should see the task listed within the section
  // ----------------------------------------------------
  it('shows the task listed within the section', () => {
    // I'm on the task list page
    cy.get('h2').contains('Application incomplete')

    // I see the expected SECTION
    cy.get('.app-task-list__section').contains('Area and funding')

    // I see the expected TASK
    cy.get('.app-task-list__task-name').contains('Funding information for CAS-2 placement')
  })

  // And the task should link to its first page
  //-------------------------------------------
  it('offers a link to the first page of the task', () => {
    // I click the link to the first page of the task
    cy.get('a').contains('Funding information for CAS-2 placement').click()

    // I'm on the expected page
    cy.get('h1').contains('Funding information for CAS-2 placement')

    // And the task list page should have the expected question and answers
    //---------------------------------------------------------
    // And I see the expected question
    cy.get('legend').contains('How will you pay for CAS-2 accommodation and the service charge?')

    // And I see the expected answers
    cy.get('label').contains('Personal money / savings')
    cy.get('label').contains(
      'Housing Benefit & Universal Credit / Disability Living Allowance / Employment & Support Allowance',
    )
  })
})
