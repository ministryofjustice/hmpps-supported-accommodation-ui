import type { TaskListErrors } from '@approved-premises/ui'
import { Page } from '../../utils/decorators'
import TaskListPage from '../../taskListPage'
import { convertKeyValuePairToRadioItems } from '../../../utils/formUtils'

export const fundingSources = {
  personalSavings: 'Personal money / savings',
  benefits: 'Housing Benefit & Universal Credit / Disability Living Allowance / Employment & Support Allowance',
}

export type FundingSources = keyof typeof fundingSources

type FundingInformationBody = {
  fundingSource: FundingSources
}

@Page({
  name: 'funding-information',
  bodyProperties: ['fundingSource'],
})
export default class FundingInformation implements TaskListPage {
  title = 'Funding information for CAS-2 placement'

  questions = {
    fundingSource: 'How will you pay for CAS-2 accommodation and the service charge?',
  }

  body: FundingInformationBody

  constructor(body: Partial<FundingInformationBody>) {
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

    return items
  }
}
