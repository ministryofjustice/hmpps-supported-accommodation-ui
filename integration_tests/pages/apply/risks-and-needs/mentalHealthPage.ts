import { Cas2Application as Application } from '../../../../server/@types/shared/models/Cas2Application'
import ApplyPage from '../applyPage'
import paths from '../../../../server/paths/apply'

export default class MentalHealthPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(`Mental health needs for ${application.person.name}`, application, 'health-needs', 'mental-health')
  }

  static visit(application: Application): void {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'health-needs',
        page: 'mental-health',
      }),
    )
  }
}