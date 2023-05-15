import PersonClient from './personClient'
import { oasysSectionsFactory } from '../testutils/factories'
import paths from '../paths/api'

import describeClient from '../testutils/describeClient'

describeClient('PersonClient', provider => {
  let personClient: PersonClient

  const token = 'token-1'

  beforeEach(() => {
    personClient = new PersonClient(token)
  })

  describe('oasysSections', () => {
    it('should return the sections of OASys when there is optional selected sections', async () => {
      const crn = 'crn'
      const optionalSections = [1, 2, 3]
      const oasysSections = oasysSectionsFactory.build()

      provider.addInteraction({
        state: 'Server is healthy',
        uponReceiving: 'A request to get the optional selected sections of OASys for a person',
        withRequest: {
          method: 'GET',
          path: paths.people.oasys.sections({ crn }),
          query: {
            'selected-sections': ['1', '2', '3'],
          },
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
        willRespondWith: {
          status: 200,
          body: oasysSections,
        },
      })

      const result = await personClient.oasysSections(crn, optionalSections)

      expect(result).toEqual(oasysSections)
    })

    it('should return the sections of OASys with no optional selected sections', async () => {
      const crn = 'crn'
      const oasysSections = oasysSectionsFactory.build()

      provider.addInteraction({
        state: 'Server is healthy',
        uponReceiving: 'A request to get sections of OASys for a person',
        withRequest: {
          method: 'GET',
          path: paths.people.oasys.sections({ crn }),
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
        willRespondWith: {
          status: 200,
          body: oasysSections,
        },
      })

      const result = await personClient.oasysSections(crn)

      expect(result).toEqual(oasysSections)
    })
  })
})
