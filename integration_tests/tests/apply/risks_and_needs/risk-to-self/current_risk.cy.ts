//  Feature: Referrer completes 'Risk to self: current risk' page
//    So that I can complete the "Risk to self" task
//    As a referrer
//    I want to complete the 'current risk' page
//
//  Background:
//    Given an application exists
//    And I am logged in
//    And I am on the current risk page
//
//  Scenario: view current risk questions
//    Then I see the "current risk" page
//
//  Scenario: navigate to next page in risk to self task
//    When I continue to the next task / page
//    Then I see the "historical risk" page

import Page from '../../../../pages/page'
import { personFactory, applicationFactory } from '../../../../../server/testutils/factories/index'
import CurrentRiskPage from '../../../../pages/apply/risks-and-needs/risk-to-self/currentRiskPage'
import HistoricalRiskPage from '../../../../pages/apply/risks-and-needs/risk-to-self/historicalRiskPage'

context('Visit "current risk" page', () => {
  const person = personFactory.build({ name: 'Roger Smith' })

  beforeEach(function test() {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')

    cy.fixture('applicationData.json').then(applicationData => {
      applicationData['health-needs'] = {}
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

    // And I am on the current risk page
    // --------------------------------
    CurrentRiskPage.visit(this.application)
  })

  //  Scenario: view current risk questions
  //    Then I see the "current risk" page
  it('presents current risk page', function test() {
    Page.verifyOnPage(CurrentRiskPage, this.application)
  })

  //  Scenario: navigate to next page in risk to self task
  //    When I continue to the next task / page
  //    Then I see the "historical risk" page
  it('navigates to the next page (physical health)', function test() {
    CurrentRiskPage.visit(this.application)
    const page = new CurrentRiskPage(this.application)
    page.clickSubmit()

    Page.verifyOnPage(HistoricalRiskPage, this.application)
  })
})
