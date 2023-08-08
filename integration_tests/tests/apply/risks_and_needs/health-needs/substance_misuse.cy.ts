//  Feature: Referrer completes 'Health needs: substance misuse' page
//    So that I can complete the "Health needs" task
//    As a referrer
//    I want to complete the 'substance misuse' page
//
//  Background:
//    Given an application exists
//    And I am logged in
//    And I have read the health needs guidance page
//
//  Scenario: view substance misuse questions
//    Then I see the "substance misuse" page
//
//  Scenario: navigate to next page in health needs task
//    When I continue to the next task / page
//    Then I see the "physical health" page

import Page from '../../../../pages/page'
import HealthNeedsGuidancePage from '../../../../pages/apply/risks-and-needs/healthNeedsGuidancePage'
import SubstanceMisusePage from '../../../../pages/apply/risks-and-needs/substanceMisusePage'
import PhysicalHealthPage from '../../../../pages/apply/risks-and-needs/physicalHealthPage'
import { personFactory, applicationFactory } from '../../../../../server/testutils/factories/index'

context('Visit "Substance misuse" page', () => {
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

    // And I have read the health needs guidance page
    // --------------------------------
    HealthNeedsGuidancePage.visit(this.application)
    const guidancePage = new HealthNeedsGuidancePage(this.application)
    guidancePage.clickSubmit()
  })

  //  Scenario: view substance misuse questions
  //    Then I see the "substance misuse" page
  it('presents substance misuse page', function test() {
    Page.verifyOnPage(SubstanceMisusePage, this.application)
  })

  //  Scenario: navigate to next page in health needs task
  //    When I continue to the next task / page
  //    Then I see the "physical health" page
  it('navigates to the next page (physical health)', function test() {
    SubstanceMisusePage.visit(this.application)
    const page = new SubstanceMisusePage(this.application)
    page.clickSubmit()

    Page.verifyOnPage(PhysicalHealthPage, this.application)
  })
})