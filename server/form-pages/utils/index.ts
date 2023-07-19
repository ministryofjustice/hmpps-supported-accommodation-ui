import type { FormArtifact, JourneyType, UiTask } from '@approved-premises/ui'
import type { Request } from 'express'
import { TaskListPageInterface } from '../taskListPage'

export const getTask = <T>(task: T) => {
  const taskPages = {}
  const slug = Reflect.getMetadata('task:slug', task)
  const name = Reflect.getMetadata('task:name', task)
  const pageClasses = Reflect.getMetadata('task:pages', task)

  pageClasses.forEach(<PageType>(page: PageType) => {
    const pageName = Reflect.getMetadata('page:name', page)
    taskPages[pageName] = page
  })

  return {
    id: slug,
    title: name,
    pages: taskPages,
  }
}

export const getSection = <T>(section: T) => {
  const tasks: Array<UiTask> = []
  const title = Reflect.getMetadata('section:title', section)
  const name = Reflect.getMetadata('section:name', section)
  const taskClasses = Reflect.getMetadata('section:tasks', section)

  taskClasses.forEach(<PageType>(task: PageType) => {
    tasks.push(getTask(task))
  })

  return {
    title,
    name,
    tasks,
  }
}

export const getPagesForSections = <T>(sections: Array<T>) => {
  const pages = {}
  sections.forEach(sectionClass => {
    const section = getSection(sectionClass)
    const { tasks } = section
    tasks.forEach(t => {
      pages[t.id] = t.pages
    })
  })
  return pages
}
export function getBody(
  Page: TaskListPageInterface,
  application: FormArtifact,
  request: Request,
  userInput: Record<string, unknown>,
) {
  if (userInput && Object.keys(userInput).length) {
    return userInput
  }
  if (Object.keys(request.body).length) {
    return request.body
  }
  return pageDataFromApplication(Page, application)
}

export const viewPath = <T>(page: T, journeyType: JourneyType) => {
  const pageName = getPageName(page.constructor)
  const taskName = getTaskName(page.constructor)
  return `${journeyType}/pages/${taskName}/${pageName}`
}

export const getPageName = <T>(page: T) => {
  return Reflect.getMetadata('page:name', page)
}

export const getTaskName = <T>(page: T) => {
  return Reflect.getMetadata('page:task', page)
}

export function pageDataFromApplication(Page: TaskListPageInterface, application: FormArtifact) {
  const pageName = getPageName(Page)
  const taskName = getTaskName(Page)

  return application.data?.[taskName]?.[pageName] || {}
}
