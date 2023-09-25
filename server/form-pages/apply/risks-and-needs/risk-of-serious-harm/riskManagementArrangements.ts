import type { Radio, TaskListErrors } from '@approved-premises/ui'
import { Cas2Application as Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { convertKeyValuePairToCheckboxItems } from '../../../../utils/formUtils'

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

  title = `Risk management arrangements for ${nameOrPlaceholderCopy(this.application.person)}`

  body: RiskManagementArrangementsBody

  questions = {
    arrangements: {
      question: `Is ${nameOrPlaceholderCopy(
        this.application.person,
      )} subject to any of these multi-agency risk management arrangements upon release?`,
      hint: 'Select all that apply',
    },
    mappaDetails: {
      question: 'Provide MAPPA details',
      hint: 'Specify whether the MAPPA is Category 2 or Category 3. Include lead contact details where possible.',
    },
    maracDetails: {
      question: 'Provide MARAC details',
      hint: 'Include lead contact details where possible.',
    },
    iomDetails: {
      question: 'Provide IOM details',
      hint: 'Include lead contact details where possible.',
    },
  }

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
      [this.questions.arrangements.question]: this.body.arrangements.toString(),
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
