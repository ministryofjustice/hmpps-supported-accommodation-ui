import type { TaskListErrors } from '@approved-premises/ui'
import { Cas2Application as Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { getOasysImportDateFromApplication } from '../../../utils'
import { convertKeyValuePairToCheckboxItems } from '../../../../utils/formUtils'
import errorLookups from '../../../../i18n/en/errors.json'
import { getQuestions } from '../../../utils/questions'

type ReducingRiskBody = {
  factorsLikelyToReduceRisk: string
  confirmation: string
}

@Page({
  name: 'reducing-risk',
  bodyProperties: ['factorsLikelyToReduceRisk', 'confirmation'],
})
export default class ReducingRisk implements TaskListPage {
  documentTitle = 'Reducing risk for the person'

  personName = nameOrPlaceholderCopy(this.application.person)

  title = `Reducing risk for ${this.personName}`

  body: ReducingRiskBody

  questions = getQuestions(this.personName)['risk-of-serious-harm']['reducing-risk']

  importDate = getOasysImportDateFromApplication(this.application, 'risk-of-serious-harm')

  constructor(
    body: Partial<ReducingRiskBody>,
    private readonly application: Application,
  ) {
    this.body = body as ReducingRiskBody
  }

  previous() {
    return 'risk-factors'
  }

  next() {
    return 'risk-management-arrangements'
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    if (!this.body.confirmation) {
      errors.confirmation = errorLookups.oasysConfirmation.empty
    }
    if (!this.body.factorsLikelyToReduceRisk) {
      errors.factorsLikelyToReduceRisk = errorLookups.factorsLikelyToReduceRisk.empty
    }

    return errors
  }

  response() {
    const response = {
      [this.questions.factorsLikelyToReduceRisk.question]: this.body.factorsLikelyToReduceRisk,
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
