import { Cas2SubmittedApplication as SubmittedApplication, FullPerson } from '@approved-premises/api'
import Page from '../page'

export default class SubmittedApplicationPage extends Page {
  constructor(private readonly application: SubmittedApplication) {
    const person = application.person as FullPerson
    super(`CAS-2 Application (submitted)`, person.name)
  }

  hasExpectedSummaryData(): void {
    const person = this.application.person as FullPerson

    cy.get('.prison-number').within(() => {
      cy.get('.govuk-summary-list__key').contains('Prison number')
      cy.get('.govuk-summary-list__value').contains(person.nomsNumber)
    })

    cy.get('.internal-id').within(() => {
      cy.get('.govuk-summary-list__key').contains('Application ID')
      cy.get('.govuk-summary-list__value').contains(this.application.id)
    })
  }
}
