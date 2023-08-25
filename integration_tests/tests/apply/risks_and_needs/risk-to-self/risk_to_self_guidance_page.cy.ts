//  Feature: Referrer completes 'Risk to self: guidance' page
//    So that I can complete the first page of the "Risk to self" task
//    As a referrer
//    I want to confirm that I've understood the guidance on that page
//
//  Scenario: Follows link from task list
//    Given there is a section with a task
//    And an application exists
//    And I am logged in
//    And I am viewing the application task list
//
//  Scenario: view "risk to self" task status
//    Then I see that the "risk to self" task has not been started
//
//  Scenario: there is OASys data
//    When I follow the link to the first page in the "Risks and needs" section
//    Then I see the "risk to self guidance" page
//    And it is populated with OASys data
//
//  Scenario: import OASys data
//    When there is OASys data
//    When I choose to import and save the data
//    Then we are taken to the vulnerability page
//
//  Scenario: there is no OASys data
//    When I follow the link to the first page in the "Risks and needs" section
//    Then I see the "risk to self guidance" page
//    And I see that there is no OASys data

import RiskToSelfGuidancePage from '../../../../pages/apply/risks-and-needs/risk-to-self/riskToSelfGuidancePage'
import Page from '../../../../pages/page'
import TaskListPage from '../../../../pages/apply/taskListPage'
import VulnerabilityPage from '../../../../pages/apply/risks-and-needs/risk-to-self/vulnerabilityPage'
import {
  personFactory,
  applicationFactory,
  oasysSectionsFactory,
} from '../../../../../server/testutils/factories/index'
import { DateFormats } from '../../../../../server/utils/dateUtils'

context('Visit "Risks and needs" section', () => {
  const person = personFactory.build({ name: 'Roger Smith' })

  beforeEach(function test() {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')

    const oasysSections = oasysSectionsFactory.build()

    cy.task('stubOasysSections', {
      crn: person.crn,
      oasysSections: {
        ...oasysSections,
        dateStarted: DateFormats.dateObjToIsoDateTime(new Date(2022, 6, 26)),
        dateCompleted: DateFormats.dateObjToIsoDateTime(new Date(2022, 6, 27)),
      },
    })

    cy.fixture('applicationData.json').then(applicationData => {
      applicationData['risk-to-self'] = {}
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

    // And I am viewing the application
    // --------------------------------
    cy.visit('applications/abc123')
    // Page.verifyOnPage(TaskListPage)
  })

  // Scenario: view task status
  // ----------------------------------------------
  it('shows the task listed within the section', () => {
    // I see that the task has not been started
    const taskListPage = Page.verifyOnPage(TaskListPage)
    taskListPage.shouldShowTaskStatus('risk-to-self', 'Not started')
  })

  // //  Scenario: reads "risk to self guidance" page
  // //    When I follow the link to the first page in the "Risks and needs" section
  // //    Then I see the "risk to self guidance" page
  it('provides the expected guidance content', function test() {
    const taskListPage = Page.verifyOnPage(TaskListPage)

    //  When I follow the link to the first page in the "Risks and needs" section
    taskListPage.visitTask('Review risk to self information')

    //  Then I see the "risk to self guidance" page
    const page = Page.verifyOnPage(RiskToSelfGuidancePage, this.application)

    //  and it's populated with data
    page.checkOasysInfo(this.application)
  })

  //  Scenario: import OASys data
  // ----------------------------------------------
  it('takes me to the vulnerability page on save', function test() {
    const taskListPage = Page.verifyOnPage(TaskListPage)

    //  When I follow the link to the first page in the "Risks and needs" section
    taskListPage.visitTask('Review risk to self information')
    //  Then I see the "risk to self guidance" page
    const page = Page.verifyOnPage(RiskToSelfGuidancePage, this.application)

    //  When I choose to import and save the data
    page.clickSubmit()

    //  Then we are taken to the vulnerability page
    Page.verifyOnPage(VulnerabilityPage, this.application)
  })

  //  Scenario: there is no OASys data
  // ----------------------------------------------
  it('shows a message to say that no OASys record exists', function test() {
    cy.task('stubOasysSectionsNotFound', {
      crn: person.crn,
    })

    const taskListPage = Page.verifyOnPage(TaskListPage)

    //  When I follow the link to the first page in the "Risks and needs" section
    taskListPage.visitTask('Review risk to self information')

    //  Then I see the "risk to self guidance" page
    const page = Page.verifyOnPage(RiskToSelfGuidancePage, this.application)

    //  And I see that there is no OASys data
    page.displaysNoOASysNotificationBanner(this.application)
  })
})
