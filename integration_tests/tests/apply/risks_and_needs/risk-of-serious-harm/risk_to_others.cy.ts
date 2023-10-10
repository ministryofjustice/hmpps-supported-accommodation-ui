//  Feature: Referrer completes 'risk to others' page
//    So that I can complete the "Risk of serious harm" task
//    As a referrer
//    I want to complete the 'risk to others' page
//
//  Background:
//    Given an application exists
//    And I am logged in
//    And I visit the 'risk to others' page
//
//  Scenario: view 'risk to others' page
//    Then I see the "risk to others" page
//    And I can click through to the RoSH summary
//
//  Scenario: view 'risk to others' page with auto-populated OASyS data
//    Then I see the "risk to others" page
//    With an OASyS import date
//    And pre-filled questions
//
//  Scenario: navigate to next page in "Risk of serious harm" task
//    When I complete the 'risk to others' page
//    When I continue to the next task / page
//    Then I see the "Risk factors" page

import Page from '../../../../pages/page'
import { personFactory, applicationFactory } from '../../../../../server/testutils/factories/index'
import RiskToOthersPage from '../../../../pages/apply/risks-and-needs/risk-of-serious-harm/riskToOthersPage'
import RiskFactorsPage from '../../../../pages/apply/risks-and-needs/risk-of-serious-harm/riskFactorsPage'

context('Visit "risk to others" page', () => {
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

    cy.fixture('applicationData.json').then(applicationData => {
      const application = applicationFactory.build({
        id: 'abc123',
        person,
        data: applicationData,
      })
      cy.wrap(application).as('applicationWithData')
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

    // And I visit the 'risk to others' page
    // --------------------------------
    RiskToOthersPage.visit(this.application)
  })

  //  Scenario: view 'risk to others' page
  // ----------------------------------------------

  it('presents risk to others page', function test() {
    //    Then I see the "risk to others" page
    const page = Page.verifyOnPage(RiskToOthersPage, this.application)

    // And I can click through to the RoSH summary
    page.shouldContainRoshSummaryLink()
  })

  //  Scenario: view 'risk to others' page with auto-populated OASyS data
  // ----------------------------------------------

  it('presents auto-populated risk to others page', function test() {
    cy.task('stubApplicationGet', { application: this.applicationWithData })
    RiskToOthersPage.visit(this.application)
    //    Then I see the "risk to others" page
    const page = Page.verifyOnPage(RiskToOthersPage, this.applicationWithData)
    //    With an OASyS import date
    page.shouldShowOasysImportDate(this.applicationWithData, 'risk-of-serious-harm')
    //    And pre-filled questions
    page.checkValueOfTextInputById('whoIsAtRisk', 'a person')
    page.checkValueOfTextInputById('natureOfRisk', 'a nature')
  })

  //  Scenario: navigate to next page in "Risk of serious harm" task
  // ----------------------------------------------
  it('navigates to the next page', function test() {
    // When I complete the 'risk to others' page
    const page = Page.verifyOnPage(RiskToOthersPage, this.application)
    page.getTextInputByIdAndEnterDetails('whoIsAtRisk', 'people at risk')
    page.getTextInputByIdAndEnterDetails('natureOfRisk', 'nature of risk')
    page.clickConfirm()

    //    When I continue to the next task / page
    page.clickSubmit()

    //    Then I see the "Risk factors" page
    Page.verifyOnPage(RiskFactorsPage, this.application)
  })
})
