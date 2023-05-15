import type { OASysSections } from '@approved-premises/api'
import type { PersonClient, RestClientBuilder } from '../data'

export default class PersonService {
  constructor(private readonly personClientFactory: RestClientBuilder<PersonClient>) {}

  async getOasysSections(token: string, crn: string, selectedSections: Array<number> = []): Promise<OASysSections> {
    const personClient = this.personClientFactory(token)

    const oasysSections = await personClient.oasysSections(crn, selectedSections)

    return oasysSections
  }
}
