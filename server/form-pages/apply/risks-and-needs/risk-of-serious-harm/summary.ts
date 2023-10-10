import type { TaskListErrors } from '@approved-premises/ui'
import { Cas2Application as Application, RiskEnvelopeStatus, RoshRisksEnvelope } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { DateFormats } from '../../../../utils/dateUtils'
import { getOasysImportDateFromApplication } from '../../../utils'

export type SummaryBody = RoshRisksEnvelope & {
  status: RiskEnvelopeStatus
  oasysImportDate: string
  additionalComments?: string
}

@Page({
  name: 'summary',
  bodyProperties: ['status', 'oasysImportDate', 'value', 'additionalComments'],
})
export default class Summary implements TaskListPage {
  documentTitle = 'Risk of serious harm (RoSH) summary for the person'

  title = `Risk of serious harm (RoSH) summary for ${nameOrPlaceholderCopy(this.application.person)}`

  body: SummaryBody

  risks: RoshRisksEnvelope & { lastUpdated: string }

  questions = { additionalComments: 'Additional comments (optional)' }

  importDate = getOasysImportDateFromApplication(this.application, 'risk-of-serious-harm')

  constructor(
    body: Partial<SummaryBody>,
    private readonly application: Application,
  ) {
    this.body = body as SummaryBody
    if (this.body.status === 'retrieved') {
      this.risks = {
        ...this.body,
        lastUpdated: this.body.value?.lastUpdated
          ? DateFormats.isoDateToUIDate(this.body.value.lastUpdated, { format: 'medium' })
          : null,
      }
    }
  }

  previous() {
    return 'taskList'
  }

  next() {
    return 'risk-to-others'
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    return errors
  }

  response() {
    const riskRatings = this.body.value
    const response = {
      'Over all risk rating': riskRatings?.overallRisk || 'Unknown',
      'Risk to children': riskRatings?.riskToChildren || 'Unknown',
      'Risk to known adult': riskRatings?.riskToKnownAdult || 'Unknown',
      'Risk to public': riskRatings?.riskToPublic || 'Unknown',
      'Risk to staff': riskRatings?.riskToStaff || 'Unknown',
    }
    if (this.body.additionalComments) {
      response[this.questions.additionalComments] = this.body.additionalComments
    }
    return response
  }
}
