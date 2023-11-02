import { Cas2Application as Application, FullPerson } from '@approved-premises/api'
import Page from '../page'
import TaskListPage from '../../../server/form-pages/taskListPage'
import { DateFormats } from '../../../server/utils/dateUtils'

import Apply from '../../../server/form-pages/apply'

export default class ApplyPage extends Page {
  taskListPage: TaskListPage

  constructor(title: string, application: Application, taskName: string, pageName: string, _backLink?: string) {
    const person = application.person as FullPerson

    super(title, person.name)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Class = Apply.pages[taskName][pageName] as any
    this.taskListPage = new Class(!!application.data?.[taskName]?.[pageName], application)

    // if (backLink) {
    //   this.checkForBackButton(backLink)
    // }

    // this.checkPhaseBanner('Give us your feedback')
  }

  selectAnswer(name: string, option: string): void {
    this.checkRadioByNameAndValue(name, option)
  }

  shouldShowOasysImportDate(application: Application, task: string): void {
    const date = application.data[task]['oasys-import'].oasysImportDate

    cy.get('p').contains(`Imported from OASys on ${DateFormats.isoDateToUIDate(date, { format: 'medium' })}`)
  }

  clickConfirm(): void {
    this.checkCheckboxByValue('confirmed')
  }
}
