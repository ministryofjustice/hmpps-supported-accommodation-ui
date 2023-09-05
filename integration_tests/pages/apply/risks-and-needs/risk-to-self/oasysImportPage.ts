import { Cas2Application as Application } from '../../../../../server/@types/shared/models/Cas2Application'
import ApplyPage from '../../applyPage'
import paths from '../../../../../server/paths/apply'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'

export default class OasysImportPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(
      `Import ${nameOrPlaceholderCopy(application.person, 'The person')}'s risk to self data from OASys`,
      application,
      'risk-to-self',
      'oasys-import',
    )
  }

  static visit(application: Application): void {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'risk-to-self',
        page: 'guidance',
      }),
    )
  }

  checkOasysInfo = (application): void => {
    cy.get('h2').contains(`OASys record available for ${application.person.name}`)
    cy.get('p').contains('Date created: 26 July 2022')
    cy.get('p').contains('Date completed: 27 July 2022')
  }

  displaysNoOASysNotificationBanner = (application): void => {
    cy.get('p').contains(`No OASys record available to import for ${application.person.name}`)
  }
}
