import type { FormArtifact, JourneyType, UiTask, YesOrNo, YesOrNoWithDetail } from '@approved-premises/ui'
import type { Request } from 'express'
import { TaskListPageInterface } from '../taskListPage'
// import { sentenceCase } from '../../utils/utils'

// export const applyYesOrNo = <K extends string>(key: K, body: Record<string, unknown>): YesOrNoWithDetail<K> => {
//   return {
//     [`${key}`]: body[`${key}`] as YesOrNo,
//     [`${key}Detail`]: body[`${key}Detail`] as string,
//   } as YesOrNoWithDetail<K>
// }

// export const yesOrNoResponseWithDetailForYes = <K extends string>(key: K, body: Record<string, unknown>) => {
//   return body[key] === 'yes' ? `Yes - ${body[`${key}Detail`]}` : 'No'
// }

// export const yesOrNoResponseWithDetailForNo = <K extends string>(key: K, body: Record<string, unknown>) => {
//   return body[key] === 'no' ? `No - ${body[`${key}Detail`]}` : 'Yes'
// }

// export const yesNoOrDontKnowResponseWithDetail = <K extends string>(key: K, body: Record<string, string>) => {
//   return body[key] === 'iDontKnow' ? "Don't know" : yesOrNoResponseWithDetailForYes<K>(key, body)
// }

export const getTask = <T>(task: T) => {
  const taskPages = {}
  const slug = Reflect.getMetadata('task:slug', task)
  const name = Reflect.getMetadata('task:name', task)
  const pageClasses = Reflect.getMetadata('task:pages', task)
  console.log('in getTask()')
  console.log('task', task)
  console.log('slug', slug)
  console.log('name', name)
  console.log('pageClasses', pageClasses)

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
  console.log('tasks', tasks)
  console.log('title', title)
  console.log('name', name)
  console.log('taskClasses', taskClasses)

  taskClasses.forEach(<PageType>(task: PageType) => {
    console.log('task in iterator: ', task)
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
    console.log('in getPagesForSection')
    console.log('section: ', section)
    console.log('tasks: ', tasks)
    tasks.forEach(t => {
      console.log('t: ', t)
      console.log('t.pages: ', t.pages)
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
  console.log('**viewPath** ', `${journeyType}/pages/${taskName}/${pageName}`)
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

// export const responsesForYesNoAndCommentsSections = (
//   sections: Record<string, string>,
//   body: Record<string, string>,
// ) => {
//   return Object.keys(sections).reduce((prev, section) => {
//     const response = {
//       ...prev,
//       [sections[section]]: sentenceCase(body[section]),
//     }

//     if (body[`${section}Comments`]) {
//       response[`${sections[section]} Additional comments`] = body[`${section}Comments`]
//     }

//     return response
//   }, {})
// }
