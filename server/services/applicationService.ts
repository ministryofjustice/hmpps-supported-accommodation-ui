import type { Request } from 'express'
import { Cas2Application as Application } from '@approved-premises/api'
import type { DataServices } from '@approved-premises/ui'
import { getBody, getPageName, getTaskName } from '../form-pages/utils'
import type { ApplicationClient, RestClientBuilder } from '../data'
import TaskListPage, { TaskListPageInterface } from '../form-pages/taskListPage'

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

  async getAllApplications(token: string): Promise<Array<Application>> {
    const applicationClient = this.applicationClientFactory(token)

    const allApplications = await applicationClient.all()

    return allApplications
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
}
