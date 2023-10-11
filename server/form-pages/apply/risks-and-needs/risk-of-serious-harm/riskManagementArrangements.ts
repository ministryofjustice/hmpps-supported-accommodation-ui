import type { Radio, TaskListErrors } from '@approved-premises/ui'
import { Cas2Application as Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { convertKeyValuePairToCheckboxItems } from '../../../../utils/formUtils'
import { getQuestions } from '../../../utils/questions'

const arrangementOptions = {
  mappa: 'Multi-Agency Public Protection Arrangements (MAPPA)',
  marac: 'Multi-Agency Risk Assessment Conference (MARAC)',
  iom: 'Integrated Offender Management (IOM)',
  no: 'No, this person does not have risk management arrangements',
}

type RiskManagementArrangementsOptions = keyof typeof arrangementOptions

export type RiskManagementArrangementsBody = {
  arrangements: Array<RiskManagementArrangementsOptions>
  mappaDetails?: string
  maracDetails?: string
  iomDetails?: string
}

@Page({
  name: 'risk-management-arrangements',
  bodyProperties: ['arrangements', 'mappaDetails', 'maracDetails', 'iomDetails'],
})
export default class RiskManagementArrangements implements TaskListPage {
  documentTitle = 'Risk management arrangements for the person'

  personName = nameOrPlaceholderCopy(this.application.person)

  title = `Risk management arrangements for ${this.personName}`

  body: RiskManagementArrangementsBody

  questions = getQuestions(this.personName)['risk-of-serious-harm']['risk-management-arrangements']

  constructor(
    body: Partial<RiskManagementArrangementsBody>,
    private readonly application: Application,
  ) {
    this.body = body as RiskManagementArrangementsBody
  }

  previous() {
    return 'reducing-risk'
  }

  next() {
    return 'cell-share-information'
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    if (!this.body.arrangements) {
      errors.arrangements =
        "Select risk management arrangements or 'No, this person does not have risk management arrangements'"
    } else {
      if (this.body.arrangements.includes('mappa') && !this.body.mappaDetails) {
        errors.mappaDetails = 'Provide MAPPA details'
      }
      if (this.body.arrangements.includes('marac') && !this.body.maracDetails) {
        errors.maracDetails = 'Provide MARAC details'
      }
      if (this.body.arrangements.includes('iom') && !this.body.iomDetails) {
        errors.iomDetails = 'Provide IOM details'
      }
    }

    return errors
  }

  response() {
    const response: Record<string, string | Array<string>> = {
      [this.questions.arrangements.question]: this.body.arrangements.map(
        arrangement => arrangementOptions[arrangement],
      ),
    }

    if (!this.body.arrangements.includes('no')) {
      response[this.questions.mappaDetails.question] = this.body.mappaDetails
      response[this.questions.maracDetails.question] = this.body.maracDetails
      response[this.questions.iomDetails.question] = this.body.iomDetails
    }

    return response
  }

  items(mappaDetailsHtml: string, maracDetailsHtml: string, iomDetailsHtml: string) {
    const items = convertKeyValuePairToCheckboxItems(arrangementOptions, this.body.arrangements) as [Radio]

    items.forEach(item => {
      if (item.value === 'mappa') {
        item.attributes = { 'data-selector': 'arrangements' }
        item.conditional = { html: mappaDetailsHtml }
      } else if (item.value === 'marac') {
        item.attributes = { 'data-selector': 'arrangements' }
        item.conditional = { html: maracDetailsHtml }
      } else if (item.value === 'iom') {
        item.attributes = { 'data-selector': 'arrangements' }
        item.conditional = { html: iomDetailsHtml }
      }
    })
    const noCheckbox = items.pop()

    return [...items, { divider: 'or' }, { ...noCheckbox }]
  }
}
