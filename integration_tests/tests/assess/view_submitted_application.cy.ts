//  Feature: Assessor views a submitted application
//    So that I can assess a submitted application
//    As an external NACRO assessor
//    I want to view a particular submitted application
//
//  Scenario: follows an external link to the submitted application
//    Given a submitted application exists
//    And I am logged in as a NACRO assessor
//    When I navigate to the url of the submitted application
//    Then I see the assessor's read-only view of the submitted application

import { submittedApplicationFactory } from '../../../server/testutils/factories/index'
import paths from '../../../server/paths/assess'
import Page from '../../pages/page'
import SubmittedApplicationPage from '../../pages/assess/submittedApplicationPage'

context('Assessor views submitted application', () => {
  const submittedApplication = submittedApplicationFactory.build()

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAssessorUser')
  })

  beforeEach(() => {
    // Given a submitted application exists
    cy.task('stubSubmittedApplicationGet', { application: submittedApplication })
  })

  //  Scenario: follows an external link to the submitted application
  // ----------------------------------------------
  it('follows an external link to the submitted application', () => {
    // And I am logged in as a NACRO assessor
    cy.signIn()

    // When I navigate to the url of the submitted application
    cy.visit(paths.submittedApplications.show({ id: submittedApplication.id }))

    // Then I see the assessor's read-only view of the submitted application
    Page.verifyOnPage(SubmittedApplicationPage, submittedApplication)
    const page = new SubmittedApplicationPage(submittedApplication)
    page.hasExpectedSummaryData()
  })
})
