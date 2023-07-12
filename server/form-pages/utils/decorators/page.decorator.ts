import { Cas2Application } from '@approved-premises/api'
import 'reflect-metadata'

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
type Constructor = new (...args: Array<any>) => {}

const Page = (options: { bodyProperties: Array<string>; name: string; controllerActions?: { update: string } }) => {
  return <T extends Constructor>(constructor: T) => {
    const TaskListPage = class extends constructor {
      name = options.name

      body: Record<string, unknown>

      document: Cas2Application

      previousPage: string

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      constructor(...args: Array<any>) {
        super(...args)
        const [body, document, previousPage] = args

        this.body = this.createBody(body, ...options.bodyProperties)
        this.document = document
        this.previousPage = previousPage
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      createBody<K extends string>(body: Record<string, any>, ...keys: Array<K>): { [Key in K]: Key } {
        const record = {} as { [Key in K]: Key }
        keys.forEach(key => {
          record[key] = body[key]
        })
        return record
      }
    }

    Reflect.defineMetadata('page:name', options.name, TaskListPage)
    Reflect.defineMetadata('page:className', constructor.name, TaskListPage)
    Reflect.defineMetadata('page:bodyProperties', options.bodyProperties, TaskListPage)
    Reflect.defineMetadata('page:controllerActions:update', options.controllerActions?.update, TaskListPage)

    return TaskListPage
  }
}

export default Page
