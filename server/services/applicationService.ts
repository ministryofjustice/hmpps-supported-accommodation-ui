import type { Request } from 'express'
import { AnyValue, Cas2Application as Application, Cas2Application } from '@approved-premises/api'
import type { DataServices, GroupedApplications } from '@approved-premises/ui'
import { getBody, getPageName, getTaskName } from '../form-pages/utils'
import type { ApplicationClient, RestClientBuilder } from '../data'
import { getApplicationSubmissionData, getApplicationUpdateData } from '../utils/applications/getApplicationData'
import TaskListPage, { TaskListPageInterface } from '../form-pages/taskListPage'
import { ValidationError } from '../utils/errors'

export default class ApplicationService {
  constructor(private readonly applicationClientFactory: RestClientBuilder<ApplicationClient>) {}

  async createApplication(token: string, crn: string): Promise<Application> {
    const applicationClient = this.applicationClientFactory(token)

    const application = await applicationClient.create(crn)

    return application
  }

  async findApplication(token: string, id: string): Promise<Application> {
    const applicationClient = this.applicationClientFactory(token)

    const application = await applicationClient.find(id)

    return application
  }

  async getAllForLoggedInUser(token: string): Promise<GroupedApplications> {
    const applicationClient = this.applicationClientFactory(token)

    const allApplications = await applicationClient.all()

    const result = {
      inProgress: [],
      submitted: [],
    } as GroupedApplications

    allApplications.map(async application => {
      if (application.status === 'inProgress') {
        result.inProgress.push(application)
      } else if (application.status === 'submitted') {
        result.submitted.push(application)
      }
    })

    return result
  }

  async save(page: TaskListPage, request: Request) {
    const errors = page.errors()

    if (Object.keys(errors).length) {
      throw new ValidationError<typeof page>(errors)
    } else {
      const application = await this.findApplication(request.user.token, request.params.id)
      const client = this.applicationClientFactory(request.user.token)

      const pageName = getPageName(page.constructor)
      const taskName = getTaskName(page.constructor)

      application.data = application.data || {}
      application.data[taskName] = application.data[taskName] || {}
      application.data[taskName][pageName] = page.body

      await client.update(application.id, getApplicationUpdateData(application))
    }
  }

  async saveData(taskData: AnyValue, request: Request) {
    const application = await this.findApplication(request.user.token, request.params.id)
    const client = this.applicationClientFactory(request.user.token)

    application.data = {
      ...application.data,
      ...taskData,
    }

    await client.update(application.id, getApplicationUpdateData(application))
  }

  async appendToList(page: TaskListPage, request: Request) {
    const errors = page.errors()

    if (Object.keys(errors).length) {
      throw new ValidationError<typeof page>(errors)
    } else {
      const application = await this.findApplication(request.user.token, request.params.id)
      const client = this.applicationClientFactory(request.user.token)

      const pageName = getPageName(page.constructor)
      const taskName = getTaskName(page.constructor)

      /* eslint-disable no-underscore-dangle */
      delete request.body._csrf

      if (this.hasPageData(application, taskName, pageName)) {
        application.data[taskName][pageName].push(request.body)
      } else {
        application.data = application.data || {}
        application.data[taskName] = application.data[taskName] || {}
        application.data[taskName][pageName] = [{ ...request.body }]
      }

      await client.update(application.id, getApplicationUpdateData(application))
    }
  }

  async removeFromList(request: Request) {
    const application = await this.findApplication(request.user.token, request.params.id)
    const client = this.applicationClientFactory(request.user.token)

    const { page, task, index } = request.params

    if (this.hasPageData(application, task, page)) {
      application.data[task][page].splice(index, 1)
      await client.update(application.id, getApplicationUpdateData(application))
    }
  }

  private hasPageData(application: Application, taskName: string, pageName: string) {
    return application.data && application.data[taskName] && application.data[taskName][pageName]
  }

  async initializePage(
    Page: TaskListPageInterface,
    request: Request,
    dataServices: DataServices,
    userInput?: Record<string, unknown>,
  ): Promise<TaskListPage> {
    const application = await this.findApplication(request.user.token, request.params.id)
    const body = getBody(Page, application, request, userInput)

    const page = Page.initialize
      ? await Page.initialize(body, application, request.user.token, dataServices)
      : new Page(body, application, request.session.previousPage)

    return page
  }

  async submit(token: string, application: Cas2Application) {
    const client = this.applicationClientFactory(token)

    await client.submit(application.id, getApplicationSubmissionData(application))
  }
}
