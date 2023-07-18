import errorLookups from '../../server/i18n/en/errors.json'

export type PageElement = Cypress.Chainable<JQuery>

export default abstract class Page {
  static verifyOnPage<T>(constructor: new () => T): T {
    return new constructor()
  }

  constructor(private readonly title: string) {
    this.checkOnPage()
  }

  checkOnPage(): void {
    cy.get('h1').contains(this.title)
  }

  signOut = (): PageElement => cy.get('[data-qa=signOut]')

  manageDetails = (): PageElement => cy.get('[data-qa=manageDetails]')

  shouldShowErrorMessagesForFields(fields: Array<string>): void {
    fields.forEach(field => {
      const errorMessagesLookup = errorLookups[field].empty

      cy.get('.govuk-error-summary').should('contain', errorMessagesLookup)
      cy.get(`[data-cy-error-${field}]`).should('contain', errorMessagesLookup)
    })
  }

  checkRadioByNameAndValue(name: string, option: string): void {
    cy.get(`input[name="${name}"][value="${option}"]`).check()
  }
}
