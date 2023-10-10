import Page from '../page'
import paths from '../../../server/paths/apply'
import { Cas2Application as Application, Cas2ApplicationSummary, FullPerson } from '../../../server/@types/shared'
import { nameOrPlaceholderCopy } from '../../../server/utils/utils'

export default class ListPage extends Page {
  constructor(
    private readonly applications: Array<Cas2ApplicationSummary>,
    name: string,
  ) {
    super('Short-Term Accommodation (CAS-2) applications', name)
  }

  static visit(applications: Array<Cas2ApplicationSummary>): ListPage {
    cy.visit(paths.applications.index.pattern)

    const person = applications[0]?.person as FullPerson

    return new ListPage(applications, person?.name)
  }

  shouldShowInProgressApplications(): void {
    this.shouldShowApplications(this.applications)
  }

  shouldShowSubmittedApplications(): void {
    cy.get('a').contains('Submitted').click()
    this.shouldShowApplications(this.applications)
  }

  clickApplication(application: Application) {
    cy.get(`a[data-cy-id="${application.id}"]`).click()
  }

  private shouldShowApplications(applications: Array<Cas2ApplicationSummary>): void {
    applications.forEach(application => {
      const personName = nameOrPlaceholderCopy(application.person)
      cy.contains(personName)
        .should('have.attr', 'href', paths.applications.show({ id: application.id }))
        .parent()
        .parent()
        .within(() => {
          cy.get('th').eq(0).contains(personName)
        })
    })
  }
}
