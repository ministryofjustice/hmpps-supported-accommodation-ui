import { Cas2Application as Application } from '@approved-premises/api'
import Page from '../page'
import TaskListPage from '../../../server/form-pages/taskListPage'

import Apply from '../../../server/form-pages/apply'

export default class ApplyPage extends Page {
  taskListPage: TaskListPage

  constructor(title: string, application: Application, taskName: string, pageName: string, backLink?: string) {
    super(title)

    // console.log('taskName', taskName)
    // console.log('pageName', pageName)
    // console.log('In applyPage Apply.pages', Apply.pages)
    // console.log('In applyPage Apply.pages[taskName]', Apply.pages[taskName])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Class = Apply.pages[taskName][pageName] as any
    // console.log('In applyPage Class', Class)

    this.taskListPage = new Class(application)

    // if (backLink) {
    //   this.checkForBackButton(backLink)
    // }

    // this.checkPhaseBanner('Give us your feedback')
  }

  checkRadioButtonFromPageBody(fieldName: string) {
    this.checkRadioByNameAndValue(fieldName, this.taskListPage.body[fieldName] as string)
  }

  checkRadioByNameAndValue(name: string, option: string): void {
    cy.get(`input[name="${name}"][value="${option}"]`).check()
  }

  //   completeTextInputFromPageBody(fieldName: string) {
  //     this.getTextInputByIdAndEnterDetails(fieldName, this.taskListPage.body[fieldName] as string)
  //   }

  //   checkCheckboxesFromPageBody(fieldName: string) {
  //     ;(this.taskListPage.body[fieldName] as Array<string>).forEach(need => {
  //       this.checkCheckboxByNameAndValue(fieldName, need)
  //     })
  //   }

  //   completeDateInputsFromPageBody(fieldName: string) {
  //     const date = this.taskListPage.body[fieldName] as string
  //     this.completeDateInputs(fieldName, date)
  //   }

  //   selectSelectOptionFromPageBody(fieldName: string) {
  //     this.getSelectInputByIdAndSelectAnEntry(fieldName, this.taskListPage.body[fieldName] as string)
  //   }

  //   checkForBackButton(path: string) {
  //     cy.get('.govuk-back-link').should('have.attr', 'href').and('include', path)
  //   }
}
