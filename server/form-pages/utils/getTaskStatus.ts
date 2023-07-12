import type { TaskStatus, UiTask } from '@approved-premises/ui'

import { Cas2Application as Application } from '@approved-premises/api'
import { TasklistPageInterface } from '../tasklistPage'

const getPageData = (application: Application, taskName: string, pageName: string) => {
  return application.data?.[taskName]?.[pageName]
}

const getTaskStatus = (task: UiTask, application: Application): TaskStatus => {
  // Find the first page that has an answer
  let pageId = Object.keys(task.pages).find((pageName: string) => !!getPageData(application, task.id, pageName))

  let status: TaskStatus

  // If there's no page that's been completed, then we know the task is incomplete
  if (!pageId) {
    return 'not_started'
  }

  while (pageId) {
    const pageData = getPageData(application, task.id, pageId)

    // If there's no page data for this page, then we know it's incomplete
    if (!pageData) {
      status = 'in_progress'
      break
    }

    // Let's initialize this page
    const Page = task.pages[pageId] as TasklistPageInterface
    const page = new Page(pageData, application)

    // Get the errors for this page
    const errors = page.errors()
    // And the next page ID
    pageId = page.next()

    if (errors.length) {
      // Are there any errors? Then the task is incomplete
      status = 'in_progress'
      break
    }

    if (!pageId) {
      // Is the next page blank? Then the task is complete
      status = 'complete'
      break
    }

    // If none of the above is true, we loop round again!
  }

  return status
}

export default getTaskStatus
