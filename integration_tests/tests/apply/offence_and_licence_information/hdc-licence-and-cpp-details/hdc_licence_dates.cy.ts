//  Feature: Referrer completes 'HDC licence dates' page
//    So that I can complete the "HDC licence and CPP details" task
//    As a referrer
//    I want to complete the 'HDC licence dates' page
//
//  Background:
//    Given an application exists
//    And I am logged in
//    And I visit the 'HDC licence dates' page
//
//  Scenario: view 'HDC licence dates' page
//    Then I see the "HDC licence dates" page
//
//  Scenario: navigate to task list on completion of task
//    When I complete the "HDC licence dates" page
//    And I continue to the next task / page
//    Then I am taken to add an offence history

import Page from '../../../../pages/page'
import { personFactory, applicationFactory } from '../../../../../server/testutils/factories/index'
import AnyPreviousConvictionsPage from '../../../../pages/apply/offence_and_licence_information/offending-history/anyPreviousConvictionsPage'
import OffenceHistoryDataPage from '../../../../pages/apply/offence_and_licence_information/offending-history/offenceHistoryDataPage'

context('Visit "HDC licence dates" page', () => {
  const person = personFactory.build({ name: 'Roger Smith' })

  beforeEach(function test() {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')

    cy.fixture('applicationData.json').then(applicationData => {
      delete applicationData['hdc-licence-and-cpp-details']
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

    // And I visit the 'HDC licence dates' page
    // --------------------------------
    AnyPreviousConvictionsPage.visit(this.application)
  })

  //  Scenario: view 'HDC licence dates' page
  // ----------------------------------------------

  it('presents HDC licence dates page', function test() {
    //    Then I see the "HDC licence dates" page
    Page.verifyOnPage(AnyPreviousConvictionsPage, this.application)
  })

  //  Scenario: navigate to Offence History page
  // ----------------------------------------------
  it('navigates to the next page', function test() {
    //    When I complete the "HDC licence dates" page
    const page = Page.verifyOnPage(AnyPreviousConvictionsPage, this.application)
    page.checkRadioByNameAndValue('hasAnyPreviousConvictions', 'yes')

    //    When I continue to the next task / page
    page.clickSubmit()

    //    Then I am taken to add an offence history
    Page.verifyOnPage(OffenceHistoryDataPage, this.application)
  })
})
