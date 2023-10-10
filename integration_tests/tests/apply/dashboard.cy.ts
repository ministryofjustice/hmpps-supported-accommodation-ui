//  Feature: Referrer views list of existing applications
//    So that I can view my existing applications
//    As a referrer
//    I want to see them listen on an application dashboard
//
//  Scenario: show in progress applications
//    Given I am logged in
//    And there are in progress applications in the database
//    When I visit the Previous Applications page
//    Then I should see all of the in progress applications
//
//  Scenario: show submitted applications
//    Given I am logged in
//    And there are submitted applications in the database
//    When I visit the Submitted Applications tab
//    Then I should see all of my submitted applications

import ListPage from '../../pages/apply/list'
import { applicationSummaryFactory } from '../../../server/testutils/factories'

context('Applications dashboard', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')

    // Given I am logged in
    cy.signIn()
  })

  //  Scenario: show in progress applications
  // ----------------------------------------------
  it('shows in progress applications', () => {
    // There are applications in the database
    const inProgressApplications = applicationSummaryFactory.buildList(5, {
      status: 'inProgress',
    })

    cy.task('stubApplications', inProgressApplications)

    // I visit the Previous Applications page
    const page = ListPage.visit(inProgressApplications)

    // I should see all of the in progress applications
    page.shouldShowInProgressApplications()
  })
  //  Scenario: show submitted applications
  it('shows in progress applications', () => {
    // There are applications in the database
    const submittedApplications = applicationSummaryFactory.buildList(5, {
      status: 'submitted',
    })

    cy.task('stubApplications', submittedApplications)

    // I visit the submitted applications tab
    const page = ListPage.visit(submittedApplications)

    // I should see all of the in progress applications
    page.shouldShowSubmittedApplications()
  })
})
