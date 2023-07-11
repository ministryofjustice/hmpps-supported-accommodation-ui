import { Cas2Application as Application } from '@approved-premises/api'
import RestClient from './restClient'
import config, { ApiConfig } from '../config'
import paths from '../paths/api'

export default class ApplicationClient {
  restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient('applicationClient', config.apis.approvedPremises as ApiConfig, token)
  }

  async find(applicationId: string): Promise<Application> {
    return (await this.restClient.get({
      path: paths.applications.show({ id: applicationId }),
    })) as Application
  }

  async create(crn: string): Promise<Application> {
    return (await this.restClient.post({
      path: paths.applications.new.pattern,
      data: { crn: crn.trim() },
    })) as Application
  }

  async all(): Promise<Array<Application>> {
    return (await this.restClient.get({ path: paths.applications.index.pattern })) as Array<Application>
  }
}
