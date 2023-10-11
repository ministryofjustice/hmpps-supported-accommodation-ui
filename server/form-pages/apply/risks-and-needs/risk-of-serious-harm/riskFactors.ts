import type { TaskListErrors } from '@approved-premises/ui'
import { Cas2Application as Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { getOasysImportDateFromApplication } from '../../../utils'
import { convertKeyValuePairToCheckboxItems } from '../../../../utils/formUtils'
import errorLookups from '../../../../i18n/en/errors.json'
import { getQuestions } from '../../../utils/questions'

type RiskFactorsBody = {
  circumstancesLikelyToIncreaseRisk: string
  whenIsRiskLikelyToBeGreatest: string
  confirmation: string
}

@Page({
  name: 'risk-factors',
  bodyProperties: ['circumstancesLikelyToIncreaseRisk', 'whenIsRiskLikelyToBeGreatest', 'confirmation'],
})
export default class RiskFactors implements TaskListPage {
  documentTitle = 'Risk factors for the person'

  personName = nameOrPlaceholderCopy(this.application.person)

  title = `Risk factors for ${this.personName}`

  body: RiskFactorsBody

  questions = getQuestions(this.personName)['risk-of-serious-harm']['risk-factors']

  importDate = getOasysImportDateFromApplication(this.application, 'risk-of-serious-harm')

  constructor(
    body: Partial<RiskFactorsBody>,
    private readonly application: Application,
  ) {
    this.body = body as RiskFactorsBody
  }

  previous() {
    return 'summary'
  }

  next() {
    return 'reducing-risk'
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    if (!this.body.confirmation) {
      errors.confirmation = errorLookups.oasysConfirmation.empty
    }
    if (!this.body.circumstancesLikelyToIncreaseRisk) {
      errors.circumstancesLikelyToIncreaseRisk = errorLookups.circumstancesLikelyToIncreaseRisk.empty
    }
    if (!this.body.whenIsRiskLikelyToBeGreatest) {
      errors.whenIsRiskLikelyToBeGreatest = errorLookups.whenIsRiskLikelyToBeGreatest.empty
    }

    return errors
  }

  response() {
    const response = {
      [this.questions.circumstancesLikelyToIncreaseRisk.question]: this.body.circumstancesLikelyToIncreaseRisk,
      [this.questions.whenIsRiskLikelyToBeGreatest.question]: this.body.whenIsRiskLikelyToBeGreatest,
      [this.questions.confirmation.question]: this.body.confirmation,
    }

    return response
  }

  items() {
    return convertKeyValuePairToCheckboxItems({ confirmed: this.questions.confirmation.question }, [
      this.body.confirmation,
    ])
  }
}
