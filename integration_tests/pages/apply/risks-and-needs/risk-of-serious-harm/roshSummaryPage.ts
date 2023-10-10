import { Cas2Application as Application } from '../../../../../server/@types/shared/models/Cas2Application'
import ApplyPage from '../../applyPage'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'
import paths from '../../../../../server/paths/apply'
import { DateFormats } from '../../../../../server/utils/dateUtils'
import { RoshRisksEnvelope } from '../../../../../server/@types/shared/models/RoshRisksEnvelope'

export default class RoshSummaryPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(
      `Risk of serious harm (RoSH) summary for ${nameOrPlaceholderCopy(application.person)}`,
      application,
      'risk-of-serious-harm',
      'summary',
    )
  }

  static visit(application: Application): void {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'risk-of-serious-harm',
        page: 'summary',
      }),
    )
  }

  shouldShowRiskData = (risks: RoshRisksEnvelope, oasysImportDate: string): void => {
    cy.get('p').contains(
      `Imported from OASys on ${DateFormats.isoDateToUIDate(oasysImportDate, {
        format: 'medium',
      })}, last updated on ${DateFormats.isoDateToUIDate(risks.value.lastUpdated, {
        format: 'medium',
      })}`,
    )

    cy.get('h3').contains(`${risks.value.overallRisk.toLocaleUpperCase()} RoSH`)

    cy.get('.rosh-widget__table').within($row => {
      cy.wrap($row).get('th').contains('Children').get('td').contains(risks.value.riskToChildren, { matchCase: false })
      cy.wrap($row).get('th').contains('Public').get('td').contains(risks.value.riskToPublic, { matchCase: false })
      cy.wrap($row)
        .get('th')
        .contains('Known adult')
        .get('td')
        .contains(risks.value.riskToKnownAdult, { matchCase: false })
      cy.wrap($row).get('th').contains('Staff').get('td').contains(risks.value.riskToStaff, { matchCase: false })
    })
  }

  shouldShowUnknownRoshCard = (): void => {
    cy.get('h3').contains('UNKNOWN LEVEL RoSH')
    cy.get('p').contains('Something went wrong. We are unable to show RoSH information.')
  }

  clickAddComments = (): void => {
    cy.get('span').contains('Add comments to this summary').click()
  }
}
