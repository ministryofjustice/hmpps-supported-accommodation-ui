import type { TaskListErrors } from '@approved-premises/ui'
import { Cas2Application as Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'

type HistoricalRiskBody = Record<string, never>

@Page({
  name: 'historical-risk',
  bodyProperties: [],
})
export default class HistoricalRisk implements TaskListPage {
  title = `${nameOrPlaceholderCopy(this.application.person, 'The person')}'s historical risks`

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

    return errors
  }

  response() {
    const response = {}

    return response
  }
}
