import type { TaskListErrors } from '@approved-premises/ui'
import type { ApprovedPremisesApplication } from '@approved-premises/api'
import { Page } from '../../utils/decorators'

import TaskListPage from '../../taskListPage'

@Page({ name: 'review', bodyProperties: ['reviewed'] })
export default class Review implements TaskListPage {
  name = 'review'

  documentTitle = 'Check your answers'

  title = 'Check your answers'

  constructor(
    public body: { reviewed?: string },
    readonly application: ApprovedPremisesApplication,
  ) {}

  previous() {
    return 'dashboard'
  }

  next() {
    return ''
  }

  response() {
    return {}
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    return errors
  }
}
