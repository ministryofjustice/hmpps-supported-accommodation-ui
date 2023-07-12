import type { TaskListErrors } from '@approved-premises/ui'
import { Page } from '../../utils/decorators'
import TaskListPage from '../../taskListPage'

export const fundingSources = {
  personalSavings: 'Personal money / savings',
  benefits: 'Housing Benefit & Universal Credit / Disability Living Allowance / Employment & Support Allowance',
}

export type FundingSources = keyof typeof fundingSources

type FundingInformationBody = {
  fundingSourceMulti: FundingSources
}

@Page({
  name: 'funding-information',
  bodyProperties: ['fundingSourceMulti'],
})
export default class FundingInformation implements TaskListPage {
  title = 'Funding information for CAS-2 placement'

  questions = {
    fundingSourceMulti: 'How will you pay for CAS-2 accommodation and the service charge?',
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
    if (!this.body.fundingSourceMulti) {
      errors.fundingSourceMulti = 'You must specify a funding source'
    }
    return errors
  }

  response() {
    const response = {
      [this.questions.fundingSourceMulti]: fundingSources[this.body.fundingSourceMulti],
    }

    Object.keys(response).forEach(key => {
      if (!response[key]) {
        delete response[key]
      }
    })

    return response
  }
}
