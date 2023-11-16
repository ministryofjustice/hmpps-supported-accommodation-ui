import { Cas2Application as Application } from '../../../../../server/@types/shared/models/Cas2Application'
import ApplyPage from '../../applyPage'
import paths from '../../../../../server/paths/apply'
import { pageIsActiveInNavigation, pageHasLinkToGuidance } from '../utils'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'

export default class OtherHealthPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(
      `Other health requirements ${nameOrPlaceholderCopy(application.person)}`,
      application,
      'health-needs',
      'other-health',
    )
    pageHasLinkToGuidance()
    pageIsActiveInNavigation('Other health')
  }

  static visit(application: Application): void {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'health-needs',
        page: 'other-health',
      }),
    )
  }

  describeLongTermHealthConditions = (): void => {
    this.checkRadioByNameAndValue('hasLongTermHealthCondition', 'yes')
    this.getTextInputByIdAndEnterDetails('healthConditionDetail', 'Chronic arthritis')
    this.checkRadioByNameAndValue('hasHadStroke', 'no')
  }

  describeSeizures = (): void => {
    this.checkRadioByNameAndValue('hasSeizures', 'yes')
    this.getTextInputByIdAndEnterDetails('seizuresDetail', 'Epilepsy: controlled by meds')
  }

  confirmCancerTreatment = (): void => {
    this.checkRadioByNameAndValue('beingTreatedForCancer', 'no')
  }
}
