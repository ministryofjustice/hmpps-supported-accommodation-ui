import Page from '../page'
import paths from '../../../server/paths/apply'
import { Cas2Application, FullPerson } from '../../../server/@types/shared'
import { DateFormats } from '../../../server/utils/dateUtils'

export default class SubmissionPage extends Page {
  constructor(
    private readonly application: Cas2Application,
    name: string,
  ) {
    super('Application answers', name)
  }

  static visit(application: Cas2Application): SubmissionPage {
    cy.visit(paths.applications.show({ id: application.id }))

    const person = application[0]?.person as FullPerson

    return new SubmissionPage(application, person?.name)
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
