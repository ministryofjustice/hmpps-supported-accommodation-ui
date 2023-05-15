import { oasysSectionsFactory } from '../testutils/factories'
import PersonService from './personService'
import { PersonClient } from '../data'

jest.mock('../data/personClient.ts')

describe('Person Service', () => {
  const personClient = new PersonClient(null) as jest.Mocked<PersonClient>
  const personClientFactory = jest.fn()

  const service = new PersonService(personClientFactory)

  const token = 'SOME_TOKEN'

  beforeEach(() => {
    jest.resetAllMocks()
    personClientFactory.mockReturnValue(personClient)
  })

  describe('getOasysSections', () => {
    it("returns the person's OASys selections given their CRN", async () => {
      const oasysSections = oasysSectionsFactory.build()

      personClient.oasysSections.mockResolvedValue(oasysSections)

      const serviceOasysSections = await service.getOasysSections(token, 'crn')

      expect(serviceOasysSections).toEqual(oasysSections)
      expect(personClientFactory).toHaveBeenCalledWith(token)
      expect(personClient.oasysSections).toHaveBeenCalledWith('crn', [])
    })
  })
})
