import ApplicationClient from './applicationClient'
import { applicationFactory } from '../testutils/factories'
import paths from '../paths/api'
import describeClient from '../testutils/describeClient'

describeClient('ApplicationClient', provider => {
  let applicationClient: ApplicationClient

  const token = 'token-1'

  beforeEach(() => {
    applicationClient = new ApplicationClient(token)
  })

  describe('find', () => {
    it('should return an application', async () => {
      const application = applicationFactory.build()

      provider.addInteraction({
        state: 'Server is healthy',
        uponReceiving: 'A request for an application',
        withRequest: {
          method: 'GET',
          path: paths.applications.show({ id: application.id }),
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
        willRespondWith: {
          status: 200,
          body: application,
        },
      })

      const result = await applicationClient.find(application.id)

      expect(result).toEqual(application)
    })
  })

  describe('create', () => {
    it('should return an application when a crn is posted', async () => {
      const application = applicationFactory.build()

      provider.addInteraction({
        state: 'Server is healthy',
        uponReceiving: 'A request to create an Application with risks',
        withRequest: {
          method: 'POST',
          path: paths.applications.new.pattern,
          body: {
            crn: application.person.crn,
          },
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
        willRespondWith: {
          status: 201,
          body: application,
        },
      })

      const result = await applicationClient.create(application.person.crn)

      expect(result).toEqual(application)
    })
  })

  describe('all', () => {
    it('should get all previous applications', async () => {
      const previousApplications = applicationFactory.buildList(5)

      provider.addInteraction({
        state: 'Server is healthy',
        uponReceiving: 'A request for all applications',
        withRequest: {
          method: 'GET',
          path: paths.applications.index.pattern,
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
        willRespondWith: {
          status: 200,
          body: previousApplications,
        },
      })

      const result = await applicationClient.all()

      expect(result).toEqual(previousApplications)
    })
  })
})
