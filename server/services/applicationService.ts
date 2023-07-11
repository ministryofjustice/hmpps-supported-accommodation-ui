import { Cas2Application as Application } from '@approved-premises/api'
import type { ApplicationClient, RestClientBuilder } from '../data'

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
}
