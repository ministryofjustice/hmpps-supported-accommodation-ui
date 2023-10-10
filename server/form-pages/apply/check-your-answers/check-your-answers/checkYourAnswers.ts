import type { TaskListErrors } from '@approved-premises/ui'
import type { Cas2Application as Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'

import TaskListPage from '../../../taskListPage'

@Page({ name: 'check-your-answers', bodyProperties: ['reviewed'] })
export default class CheckYourAnswers implements TaskListPage {
  documentTitle = 'Check your answers'

  title = 'Check your answers'

  constructor(
    public body: { reviewed?: string },
    readonly application: Application,
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
