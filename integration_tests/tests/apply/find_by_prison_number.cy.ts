//  Feature: Referrer enters prison number of applicant to begin application process
//    So that I can create an application
//    As a referrer
//    I want to enter the prison number of the applicant and see that the correct person is returned
//
//  Scenario: follow link from applications dashboard
//    Given I'm on the applications dashboard
//    And I click the link to start a new application
//    Then I'm on the Enter prison number page
//
//  Scenario: enter a prison number and continue to the 'Before you start' section without seeing the task list
//    Given I'm on the enter prison number page
//    When I enter an existing prison number
//    And I click save and continue
//    Then I'm on the first task of the 'Before you start' section
//
//  Scenario: answer is enforced
//    Given I'm on the enter prison number page
//    When I click continue without entering a prison number
//    Then I that an answer is required
//
//  Scenario: enter a prison number that can't be found
//    Given I'm on the enter prison number page
//    When I enter a prison number that can't be found
//    Then I see a not found error message
//
//  Scenario: enter a prison number for a person I'm not authorised to view
//    Given I'm on the enter prison number page
//    When I enter a prison number for a person I'm not authorised to view
//    Then I see an unathorised error message

import ConfirmEligibilityPage from '../../pages/apply/confirmEligibilityPage'
import { personFactory, applicationFactory } from '../../../server/testutils/factories/index'
import Page from '../../pages/page'
import FindByPrisonNumberPage from '../../pages/apply/findByPrisonNumberPage'
import ListPage from '../../pages/apply/list'

context('Find by prison number', () => {
  const person = personFactory.build({ name: 'Roger Smith', nomsNumber: '123' })
  const applications = applicationFactory.buildList(3)

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
  })

  beforeEach(() => {
    // Given I am logged in
    cy.signIn()

    // and there are existing applications
    cy.task('stubApplications', applications)
  })

  //  Scenario: follow link from applications dashboard
  // ----------------------------------------------
  it('start new application button takes me to the enter prison number page', () => {
    // I'm on the applications dashboard
    ListPage.visit([])

    // I click the link to start a new application
    cy.get('a').contains('Start a new application').click()

    // I'm on the Enter prison number page
    Page.verifyOnPage(FindByPrisonNumberPage)
  })

  //  Scenario: enter a prison number and continue to 'Before you start' section without seeing the task list
  // ----------------------------------------------
  it('creates an application and continues to "Before you start" section (before task list)', () => {
    // I'm on the enter prison number page
    const page = FindByPrisonNumberPage.visit(person.name)

    // I enter an existing prison number
    page.getTextInputByIdAndEnterDetails('prisonNumber', person.nomsNumber)
    cy.task('stubFindPerson', { person })
    const application = applicationFactory.build({
      person,
      data: {
        'confirm-eligibility': {
          'confirm-eligibility': {},
        },
      },
    })
    // for the data:
    // -------------
    //   'task-name': {
    //     'page-name' : { form properties }
    //   }

    cy.task('stubCreateApplication', { application })
    cy.task('stubApplicationGet', { application })

    // I click save and continue
    page.clickSubmit()

    // Then I'm on the 'Confirm eligibility' page (in 'Before you start' section)
    Page.verifyOnPage(ConfirmEligibilityPage, application)
  })

  //  Scenario: answer is enforced
  // ----------------------------------------------
  it('enforces an enswer', () => {
    // I'm on the enter prison number page
    const page = FindByPrisonNumberPage.visit(person.name)

    // I click continue without entering a prison number
    page.clickSubmit()

    // Then I see an error message
    cy.get('.govuk-error-summary').should('contain', `You must enter a prison number`)
    cy.get(`[data-cy-error-prisonNumber]`).should('contain', `You must enter a prison number`)
  })

  //  Scenario: enter a prison number that can't be found
  // ----------------------------------------------
  it('renders with a prison number not found error', () => {
    // I'm on the enter prison number page
    const page = FindByPrisonNumberPage.visit(person.name)

    // I enter a prison number that can't be found
    page.getTextInputByIdAndEnterDetails('prisonNumber', person.nomsNumber)
    cy.task('stubPersonNotFound', { person })
    page.clickSubmit()

    // I see a not found error message
    cy.get('.govuk-error-summary').should(
      'contain',
      `No person with a prison number of '${person.nomsNumber}' was found`,
    )
    cy.get(`[data-cy-error-prisonNumber]`).should(
      'contain',
      `No person with a prison number of '${person.nomsNumber}' was found`,
    )
  })

  //  Scenario: enter a prison number for a person I'm not authorised to view
  // ----------------------------------------------
  it('renders with an unauthorised error', () => {
    cy.task('stubFindPersonForbidden', {
      person,
    })

    // I'm on the enter prison number page
    const page = FindByPrisonNumberPage.visit(person.name)

    // I enter a prison number that can't be found

    cy.get('#prisonNumber').type(person.nomsNumber)
    page.clickSubmit()

    // I see an unathorised error message
    cy.get('.govuk-error-summary').should(
      'contain',
      `You do not have permission to access the prison number ${person.nomsNumber}`,
    )
    cy.get(`[data-cy-error-prisonNumber]`).should(
      'contain',
      `You do not have permission to access the prison number ${person.nomsNumber}`,
    )
  })
})