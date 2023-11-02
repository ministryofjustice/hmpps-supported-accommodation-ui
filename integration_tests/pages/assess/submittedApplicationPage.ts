import { Cas2SubmittedApplication as SubmittedApplication, FullPerson } from '@approved-premises/api'
import Page from '../page'
import { DateFormats } from '../../../server/utils/dateUtils'

export default class SubmittedApplicationPage extends Page {
  constructor(private readonly application: SubmittedApplication) {
    const person = application.person as FullPerson
    super('Application answers', person.name)
  }

  hasExpectedSummaryData(): void {
    const person = this.application.person as FullPerson

    cy.get('#application-summary').within(() => {
      cy.get('li').contains(this.application.id)
      cy.get('li').contains(person.name)
      cy.get('li').contains(person.nomsNumber)
      cy.get('li').contains(DateFormats.isoDateToUIDate(this.application.submittedAt, { format: 'medium' }))
    })
  }
}
