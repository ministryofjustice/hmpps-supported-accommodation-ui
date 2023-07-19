import { Cas2Application as Application } from '@approved-premises/api'
import Page from '../page'
import TaskListPage from '../../../server/form-pages/taskListPage'

import Apply from '../../../server/form-pages/apply'

export default class ApplyPage extends Page {
  taskListPage: TaskListPage

  constructor(title: string, application: Application, taskName: string, pageName: string, _backLink?: string) {
    super(title)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Class = Apply.pages[taskName][pageName] as any
    this.taskListPage = new Class(application.data?.[taskName]?.[pageName], application)

    // if (backLink) {
    //   this.checkForBackButton(backLink)
    // }

    // this.checkPhaseBanner('Give us your feedback')
  }

  checkRadioButtonFromPageBody(fieldName: string) {
    this.checkRadioByNameAndValue(fieldName, this.taskListPage.body[fieldName] as string)
  }
}
