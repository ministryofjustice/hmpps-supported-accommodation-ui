import type { TaskListErrors, YesOrNo } from '@approved-premises/ui'
import { Page } from '../../utils/decorators'
import TaskListPage from '../../taskListPage'
// import { sentenceCase } from '../../../utils/utils'

type FundingInformationBody = {
  funding: YesOrNo
}

@Page({
  name: 'funding-information',
  bodyProperties: ['fundingYesNo'],
})
export default class FundingInformation implements TaskListPage {
  title = 'Funding information for CAS-2 placement'

  questions = {
    fundingYesNo: 'Is your placement funded by xyz?',
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

    return errors
  }

  response() {
    const response = {}

    Object.keys(response).forEach(key => {
      if (!response[key]) {
        delete response[key]
      }
    })

    return response
  }
}
