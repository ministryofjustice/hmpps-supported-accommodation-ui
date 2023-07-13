import { Cas2Application as Application } from '@approved-premises/api'
import Page from '../page'
import TasklistPage from '../../../server/form-pages/tasklistPage'

import Apply from '../../../server/form-pages/apply'

export default class ApplyPage extends Page {
  tasklistPage: TasklistPage

  constructor(title: string, application: Application, taskName: string, pageName: string, backLink?: string) {
    super(title)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Class = Apply.pages[taskName][pageName] as any

    this.tasklistPage = new Class(application.data?.[taskName]?.[pageName], application)

    // if (backLink) {
    //   this.checkForBackButton(backLink)
    // }

    // this.checkPhaseBanner('Give us your feedback')
  }

  checkRadioButtonFromPageBody(fieldName: string) {
    this.checkRadioByNameAndValue(fieldName, this.tasklistPage.body[fieldName] as string)
  }

  //   completeTextInputFromPageBody(fieldName: string) {
  //     this.getTextInputByIdAndEnterDetails(fieldName, this.tasklistPage.body[fieldName] as string)
  //   }

  //   checkCheckboxesFromPageBody(fieldName: string) {
  //     ;(this.tasklistPage.body[fieldName] as Array<string>).forEach(need => {
  //       this.checkCheckboxByNameAndValue(fieldName, need)
  //     })
  //   }

  //   completeDateInputsFromPageBody(fieldName: string) {
  //     const date = this.tasklistPage.body[fieldName] as string
  //     this.completeDateInputs(fieldName, date)
  //   }

  //   selectSelectOptionFromPageBody(fieldName: string) {
  //     this.getSelectInputByIdAndSelectAnEntry(fieldName, this.tasklistPage.body[fieldName] as string)
  //   }

  //   checkForBackButton(path: string) {
  //     cy.get('.govuk-back-link').should('have.attr', 'href').and('include', path)
  //   }
}
