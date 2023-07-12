/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */

import TasklistPage from '../../tasklistPage'

type Constructor = new (...args: Array<any>) => {}

interface Type<T> extends Function {
  new (...args: Array<any>): T
}

const Task = (options: { name: string; slug: string; pages: Array<Type<TasklistPage>> }) => {
  return <T extends Constructor>(constructor: T) => {
    Reflect.defineMetadata('task:slug', options.slug, constructor)
    Reflect.defineMetadata('task:name', options.name, constructor)
    Reflect.defineMetadata('task:pages', options.pages, constructor)
    options.pages.forEach(page => {
      Reflect.defineMetadata('page:task', options.slug, page)
    })
  }
}

export default Task
