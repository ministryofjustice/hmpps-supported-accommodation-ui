import type { TaskListErrors } from '@approved-premises/ui'
import { Cas2Application } from '@approved-premises/api'
import { Page } from '../../../../utils/decorators'
import TaskListPage from '../../../../taskListPage'
import { getQuestions } from '../../../../utils/questions'

export type BehaviourNotesDataBody = {
  behaviourDetail: string
}

@Page({
  name: 'behaviour-notes-data',
  bodyProperties: ['behaviourDetail'],
})
export default class BehaviourNotesData implements TaskListPage {
  title = 'Add a behaviour note'

  documentTitle = this.title

  body: BehaviourNotesDataBody

  questions = getQuestions('')['risk-of-serious-harm']['behaviour-notes-data']

  taskName = 'risk-of-serious-harm'

  pageName = 'behaviour-notes-data'

  constructor(
    body: Partial<BehaviourNotesDataBody>,
    private readonly application: Cas2Application,
  ) {
    this.body = body as BehaviourNotesDataBody
  }

  previous() {
    return 'behaviour-notes'
  }

  next() {
    return 'behaviour-notes'
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    if (!this.body.behaviourDetail) {
      errors.behaviourDetail = "Describe the applicant's behaviour"
    }

    return errors
  }

  response() {
    const response = this.application.data['risk-of-serious-harm']?.['behaviour-notes-data'] || []

    return response
  }
}
