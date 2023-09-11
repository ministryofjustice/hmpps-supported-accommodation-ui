//  Feature: Referrer completes 'cell share information' page
//    So that I can complete the "Risk of serious harm" task
//    As a referrer
//    I want to complete the 'cell share information' page
//
//  Background:
//    Given an application exists
//    And I am logged in
//    And I visit the 'cell share information' page
//
//  Scenario: view 'cell share information' page
//    Then I see the "cell share information" page
//
//  Scenario: navigate to next page in "Risk of serious harm" task
//    When I continue to the next task / page
//    Then I see the "behaviour notes" page

import Page from '../../../../pages/page'
import { personFactory, applicationFactory } from '../../../../../server/testutils/factories/index'
import CellShareInformationPage from '../../../../pages/apply/risks-and-needs/risk-of-serious-harm/cellShareInformationPage'
import BehaviourNotesPage from '../../../../pages/apply/risks-and-needs/risk-of-serious-harm/behaviourNotesPage'

context('Visit "cell share information" page', () => {
  const person = personFactory.build({ name: 'Roger Smith' })

  beforeEach(function test() {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')

    cy.fixture('applicationData.json').then(applicationData => {
      applicationData['risk-of-serious-harm'] = {}
      const application = applicationFactory.build({
        id: 'abc123',
        person,
        data: applicationData,
      })
      cy.wrap(application).as('application')
    })
  })

  beforeEach(function test() {
    // And an application exists
    // -------------------------
    cy.task('stubApplicationGet', { application: this.application })
    cy.task('stubApplicationUpdate', { application: this.application })

    // Given I am logged in
    //---------------------
    cy.signIn()

    // And I visit the 'cell share information' page
    // --------------------------------
    CellShareInformationPage.visit(this.application)
  })

  //  Scenario: view 'cell share information' page
  // ----------------------------------------------

  it('presents cell share information page', function test() {
    //    Then I see the "cell share information" page
    Page.verifyOnPage(CellShareInformationPage, this.application)
  })

  //  Scenario: navigate to next page in "Risk of serious harm" task
  // ----------------------------------------------
  it('navigates to the next page', function test() {
    //    When I continue to the next task / page
    const page = Page.verifyOnPage(CellShareInformationPage, this.application)
    page.clickSubmit()

    //    Then I see the "behaviour notes" page
    Page.verifyOnPage(BehaviourNotesPage, this.application)
  })
})