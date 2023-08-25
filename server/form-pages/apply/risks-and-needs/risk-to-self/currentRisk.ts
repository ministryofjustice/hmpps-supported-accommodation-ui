import type { TaskListErrors } from '@approved-premises/ui'
import { Cas2Application as Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'

type CurrentRisksBody = Record<string, never>

@Page({
  name: 'current-risks',
  bodyProperties: [],
})
export default class CurrentRisk implements TaskListPage {
  title = `${nameOrPlaceholderCopy(this.application.person, 'The person')}'s current risks`

  body: CurrentRisksBody

  constructor(
    body: Partial<CurrentRisksBody>,
    private readonly application: Application,
  ) {
    this.body = body as CurrentRisksBody
  }

  previous() {
    return 'guidance'
  }

  next() {
    return 'current-risks'
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
