import type { FormArtifact, JourneyType, UiTask, YesOrNo, YesOrNoWithDetail } from '@approved-premises/ui'

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

export const getPageName = <T>(page: T) => {
  return Reflect.getMetadata('page:name', page)
}

export const getTaskName = <T>(page: T) => {
  return Reflect.getMetadata('page:task', page)
}
