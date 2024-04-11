import Page, { PageElement } from './page'

export default class HomePage extends Page {
  constructor() {
    const name = undefined
    super('CAS-2: Short-Term Accommodation', name)
    this.checkPhaseBanner()
  }

  static visit(): HomePage {
    cy.visit('/')

    return new HomePage()
  }

  shouldShowSignOutButton(): void {
    cy.get('[data-qa="signOut"]').should('exist')
  }

  shouldShowCards(sections: Array<string>) {
    sections.forEach(section => cy.get(`[data-cy-card-section="${section}"]`).should('exist'))
  }

  shouldNotShowCards(sections: Array<string>) {
    sections.forEach(section => cy.get(`[data-cy-card-section="${section}"]`).should('not.exist'))
  }

  headerUserName = (): PageElement => cy.get('[data-qa=header-user-name]')

  checkPhaseBanner(): void {
    cy.get('[data-cy-phase-banner="phase-banner"]').contains('This is a new service')
  }
}
