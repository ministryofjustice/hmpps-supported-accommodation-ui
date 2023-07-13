import type { TaskListErrors } from '@approved-premises/ui'
import { Cas2Application as Application } from '@approved-premises/api'
import { Page } from '../../utils/decorators'
import TaskListPage from '../../taskListPage'
import { convertKeyValuePairToRadioItems } from '../../../utils/formUtils'

export const fundingSources = {
  personalSavings: 'Personal money or savings',
  benefits: 'Benefits',
}
const benefitsHint =
  'This includes Housing Benefit and Universal Credit, Disability Living Allowance, and Employment and Support Allowance'

export type FundingSources = keyof typeof fundingSources

type FundingInformationBody = {
  fundingSource: FundingSources
}

@Page({
  name: 'funding-information',
  bodyProperties: ['fundingSource'],
})
export default class FundingInformation implements TaskListPage {
  title = 'Funding information'

  questions = {
    fundingSource: `How will ${this.application.person.name} pay for their accommodation and service charge?`,
  }

  body: FundingInformationBody

  constructor(body: Partial<FundingInformationBody>, private readonly application: Application) {
    this.body = body as FundingInformationBody
  }

  previous() {
    return 'dashboard'
  }

  next() {
    return ''
  }

  errors() {
    const errors: TaskListErrors<this> = {}
    if (!this.body.fundingSource) {
      errors.fundingSource = 'You must specify a funding source'
    }
    return errors
  }

  response() {
    const response = {
      [this.questions.fundingSource]: fundingSources[this.body.fundingSource],
    }

    Object.keys(response).forEach(key => {
      if (!response[key]) {
        delete response[key]
      }
    })

    return response
  }

  items() {
    const items = convertKeyValuePairToRadioItems(fundingSources, this.body.fundingSource)
    return items.map(radio => {
      if (radio.value === 'benefits') {
        return { ...radio, hint: { text: benefitsHint } }
      }
      return radio
    })
  }
}
