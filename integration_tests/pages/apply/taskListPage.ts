import Page from '../page'
import Apply from '../../../server/form-pages/apply'
import paths from '../../../server/paths/apply'
import { Cas2Application } from '../../../server/@types/shared/models/Cas2Application'
import { FullPerson } from '../../../server/@types/shared/models/FullPerson'

export default class TaskListPage extends Page {
  constructor(name: string) {
    super('Apply for Short-Term Accommodation (CAS-2)', name)
  }

  static visit(application: Cas2Application): TaskListPage {
    cy.visit(paths.applications.show({ id: application.id }))

    const person = application.person as FullPerson

    return new TaskListPage(person.name)
  }

  shouldShowTasksWithinTheirSections = (): void => {
    Apply.sections.forEach(section => {
      cy.get(`[data-section_name="${section.title}"]`).within(() => {
        // And I see the expected SECTION
        cy.get('.app-task-list__section').contains(section.title)

        // And I see each expected TASK
        section.tasks.forEach(task => {
          cy.get('.app-task-list__task-name').contains(task.title)
        })
      })
    })
  }

  shouldShowTaskStatus = (task: string, status: string): void => {
    cy.get(`#${task}-status`).should('contain', status)
  }

  shouldShowTaskWithinSection = (taskTitle: string, sectionTitle: string): void => {
    cy.get(`[data-section_name="${sectionTitle}"]`).within(() => {
      // And I see the expected SECTION title
      cy.get('.app-task-list__section').contains(sectionTitle)

      // And I see each expected TASK title
      cy.get('.app-task-list__task-name').contains(taskTitle)
    })
  }

  visitTask = (taskTitle: string): void => {
    cy.get('.app-task-list__task-name').contains(taskTitle).click()
  }
}
