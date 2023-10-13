import type { TaskListErrors } from '@approved-premises/ui'
import { Cas2Application as Application } from '@approved-premises/api'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { getOasysImportDateFromApplication } from '../../../utils'
import { convertKeyValuePairToCheckboxItems } from '../../../../utils/formUtils'
import errorLookups from '../../../../i18n/en/errors.json'
import { getQuestions } from '../../../utils/questions'

type HistoricalRiskBody = { historicalRiskDetail: string; confirmation: string }

@Page({
  name: 'historical-risk',
  bodyProperties: ['historicalRiskDetail', 'confirmation'],
})
export default class HistoricalRisk implements TaskListPage {
  documentTitle = "The person's historical risks"

  personName = nameOrPlaceholderCopy(this.application.person)

  title = `${this.personName}'s historical risks`

  questions = getQuestions(this.personName)['risk-to-self']['historical-risk']

  importDate = getOasysImportDateFromApplication(this.application, 'risk-to-self')

  body: HistoricalRiskBody

  constructor(
    body: Partial<HistoricalRiskBody>,
    private readonly application: Application,
  ) {
    this.body = body as HistoricalRiskBody
  }

  previous() {
    return 'current-risk'
  }

  next() {
    return 'acct'
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    if (!this.body.historicalRiskDetail) {
      errors.historicalRiskDetail = `Describe ${this.personName}'s historical issues and needs related to self harm and suicide`
    }
    if (!this.body.confirmation) {
      errors.confirmation = errorLookups.oasysConfirmation.empty
    }

    return errors
  }

  response() {
    const response = {
      [this.questions.historicalRiskDetail.question]: this.body.historicalRiskDetail,
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
