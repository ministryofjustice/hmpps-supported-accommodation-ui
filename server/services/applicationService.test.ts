import ApplicationService from './applicationService'
import ApplicationClient from '../data/applicationClient'

import { applicationFactory } from '../testutils/factories'

jest.mock('../data/applicationClient.ts')
jest.mock('../data/personClient.ts')

describe('ApplicationService', () => {
  const applicationClient = new ApplicationClient(null) as jest.Mocked<ApplicationClient>
  const applicationClientFactory = jest.fn()

  const service = new ApplicationService(applicationClientFactory)

  beforeEach(() => {
    jest.resetAllMocks()
    applicationClientFactory.mockReturnValue(applicationClient)
  })

  describe('createApplication', () => {
    it('calls the create method and returns an application', async () => {
      const application = applicationFactory.build()

      const token = 'SOME_TOKEN'

      applicationClient.create.mockResolvedValue(application)

      const result = await service.createApplication(token, application.person.crn)

      expect(result).toEqual(application)

      expect(applicationClientFactory).toHaveBeenCalledWith(token)
      expect(applicationClient.create).toHaveBeenCalledWith(application.person.crn)
    })
  })

  describe('findApplication', () => {
    it('calls the find method and returns an application', async () => {
      const application = applicationFactory.build()
      const token = 'SOME_TOKEN'

      applicationClient.find.mockResolvedValue(application)

      const result = await service.findApplication(token, application.id)

      expect(result).toEqual(application)

      expect(applicationClientFactory).toHaveBeenCalledWith(token)
      expect(applicationClient.find).toHaveBeenCalledWith(application.id)
    })
  })

  describe('getAllApplications', () => {
    const token = 'SOME_TOKEN'
    const applications = applicationFactory.buildList(5)

    it('fetches all applications', async () => {
      applicationClient.all.mockResolvedValue(applications)

      const result = await service.getAllApplications(token)

      expect(result).toEqual(applications)

      expect(applicationClientFactory).toHaveBeenCalledWith(token)
      expect(applicationClient.all).toHaveBeenCalled()
    })
  })
})
