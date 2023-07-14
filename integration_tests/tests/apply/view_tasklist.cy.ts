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
import Page from '../../pages/page'
import TaskListPage from '../../pages/apply/taskListPage'
import FundingInformationPage from '../../pages/apply/fundingInformationPage'
import { personFactory, applicationFactory } from '../../../server/testutils/factories/index'

context('New', () => {
  const person = personFactory.build({ name: 'Roger Smith' })

  beforeEach(function test() {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')

    cy.fixture('applicationData.json').then(applicationData => {
      const application = applicationFactory.build({ id: 'abc123', person })
      application.data = applicationData
      cy.wrap(application).as('application')
      cy.wrap(application.data).as('applicationData')
    })
  })

  beforeEach(function test() {
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

    const newApplication = applicationFactory.build({ id: 'abc123', person })

    cy.task('stubCreateApplication', { application: newApplication })
    cy.task('stubApplicationGet', { application: newApplication })
    cy.task('stubApplicationUpdate', { application: newApplication })

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
    cy.get('.app-task-list__task-name').contains('Funding information')

    // And I should see that the task has not been started
    const taskListPage = Page.verifyOnPage(TaskListPage)
    taskListPage.shouldShowTaskStatus('area-and-funding', 'Not started')
  })

  // And the task should link to its first page
  //-------------------------------------------
  it('offers a link to the first page of the task', () => {
    // I click the link to the first page of the task
    cy.get('a').contains('Funding information').click()

    // I'm on the expected page
    cy.get('h1').contains('Funding information')

    // And the task list page should have the expected question and answers
    //---------------------------------------------------------
    // And I see the expected question
    cy.get('legend').contains('How will Roger Smith pay for their accommodation and service charge')

    // And I see the expected answers
    cy.get('label').contains('Personal money or savings')
    cy.get('label').contains('Benefits')
    cy.get('.govuk-hint.govuk-radios__hint').contains(
      'This includes Housing Benefit and Universal Credit, Disability Living Allowance, and Employment and Support Allowance',
    )
  })

  // When I try to continue without answer the question
  // -------------------------------------------
  it('enforces answer', function test() {
    // Given I'm on the Funding information task page
    cy.get('a').contains('Funding information').click()

    // I attempt to continue without making a choice
    cy.get('button').contains('Save and continue').click()

    // Then I see that an answer is required
    const fundingInfoPage = new FundingInformationPage(this.application)
    fundingInfoPage.shouldShowErrorMessagesForFields(['fundingSource'])
  })

  // When I select an answer and submit the form
  // -------------------------------------------
  it('submits the form', function test() {
    // Given I'm on the Funding information task page
    cy.get('a').contains('Funding information').click()
    const page = Page.verifyOnPage(FundingInformationPage, this.application)

    // When I select an option and click save and continue
    page.checkRadioButtonFromPageBody('fundingSource')

    // after submission of the valid form the API will return the answered question
    // -- note that the presence of the _page_ only is required in application.data
    //    to signify that the page is complete
    const answered = {
      ...this.application,
      data: {
        'area-and-funding': {
          'funding-information': {},
        },
      },
    }
    cy.task('stubApplicationGet', { application: answered })

    page.clickSubmit()

    // Then I return to the task list
    const taskListPage = Page.verifyOnPage(TaskListPage)

    // And I should see that the task is now complete
    taskListPage.shouldShowTaskStatus('area-and-funding', 'Completed')
  })
})
