import type { TaskListErrors, YesOrNo } from '@approved-premises/ui'
import { Page } from '../../utils/decorators'
import TaskListPage from '../../taskListPage'
// import { sentenceCase } from '../../../utils/utils'

type FundingInformationBody = {}

@Page({
  name: 'funding-information',
  bodyProperties: [],
})
export default class FundingInformation implements TaskListPage {
  title = 'Funding information'

  questions = {}

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
