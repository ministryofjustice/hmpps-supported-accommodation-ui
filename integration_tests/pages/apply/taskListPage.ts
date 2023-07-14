import Page from '../page'

export default class TaskListPage extends Page {
  constructor() {
    super('CAS 2: Refer for Accommodation')
  }

  shouldShowTaskStatus = (task: string, status: string): void => {
    cy.get(`#${task}-status`).should('contain', status)
  }
}
