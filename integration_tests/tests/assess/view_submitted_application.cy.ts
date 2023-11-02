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
import { fullPersonFactory } from '../../../server/testutils/factories/person'

context('Assessor views submitted application', () => {
  // const submittedApplication = submittedApplicationFactory.build()s

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAssessorUser')
  })

  beforeEach(() => {
    // Given a submitted application exists
    // I have submitted an application

    cy.fixture('applicationDocument.json').then(applicationDocument => {
      const submittedApplication = submittedApplicationFactory.build({
        id: 'abc123',
        document: applicationDocument,
        status: 'submitted',
        submittedAt: '2022-12-10T21:47:28Z',
        person: fullPersonFactory.build({ name: 'Robert Smith' }),
      })
      cy.wrap(submittedApplication).as('submittedApplication')
      cy.task('stubSubmittedApplicationGet', { application: submittedApplication })
    })
  })

  //  Scenario: follows an external link to the submitted application
  // ----------------------------------------------
  it('follows an external link to the submitted application', function test() {
    // And I am logged in as a NACRO assessor
    cy.signIn()

    // When I navigate to the url of the submitted application
    cy.visit(paths.submittedApplications.show({ id: this.submittedApplication.id }))

    // Then I see the assessor's read-only view of the submitted application
    Page.verifyOnPage(SubmittedApplicationPage, this.submittedApplication)
    const page = new SubmittedApplicationPage(this.submittedApplication)
    page.hasExpectedSummaryData()
    page.hasQuestionsAndAnswersFromDocument(this.submittedApplication.document)
  })
})
