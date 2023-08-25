import { Cas2Application as Application } from '../../../../../server/@types/shared/models/Cas2Application'
import ApplyPage from '../../applyPage'
import paths from '../../../../../server/paths/apply'
import { pageIsActiveInNavigation, fieldIsOptional } from '../utils'

export default class MentalHealthPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(`Mental health needs for ${application.person.name}`, application, 'health-needs', 'mental-health')

    pageIsActiveInNavigation('Mental health')
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

  describeNeeds = (): void => {
    this.checkRadioByNameAndValue('hasMentalHealthNeeds', 'yes')
    this.getTextInputByIdAndEnterDetails('needsDetail', 'Has depression')
  }

  describeEngagement = (): void => {
    this.checkRadioByNameAndValue('isEngagedWithCommunity', 'yes')
    this.getTextInputByIdAndEnterDetails('servicesDetail', 'Attend the The Well Clinic')
  }

  describeMedication = (): void => {
    this.checkRadioByNameAndValue('hasPrescribedMedication', 'yes')
    this.checkRadioByNameAndValue('isInPossessionOfMeds', 'no')
    this.getTextInputByIdAndEnterDetails('medicationDetail', 'Amitriptyline')
    fieldIsOptional('medicationIssues')
    this.getTextInputByIdAndEnterDetails('medicationIssues', 'Sometimes fails to take pills')
  }
}