import type { TaskListErrors } from '@approved-premises/ui'
import { Cas2Application as Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'

type GuidanceBody = Record<string, never>

@Page({
  name: 'guidance',
  bodyProperties: [],
})
export default class Guidance implements TaskListPage {
  title = `Request health information for ${this.application.person.name}`

  body: GuidanceBody

  constructor(
    body: Partial<GuidanceBody>,
    private readonly application: Application,
  ) {
    this.body = body as GuidanceBody
  }

  previous() {
    return 'taskList'
  }

  next() {
    return 'substance-misuse'
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