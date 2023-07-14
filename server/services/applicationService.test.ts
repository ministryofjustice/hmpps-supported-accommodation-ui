import { DeepMocked, createMock } from '@golevelup/ts-jest'
import type { Request } from 'express'
import { UpdateCas2Application } from 'server/@types/shared/models/UpdateCas2Application'
import { TaskListErrors } from '@approved-premises/ui'
import ApplicationService from './applicationService'
import ApplicationClient from '../data/applicationClient'
import TaskListPage from '../form-pages/taskListPage'
import { getPageName, getTaskName } from '../form-pages/utils'
import { ValidationError } from '../utils/errors'
import { getApplicationUpdateData } from '../utils/applications/getApplicationData'

import { applicationFactory } from '../testutils/factories'

jest.mock('../data/applicationClient.ts')
jest.mock('../data/personClient.ts')
jest.mock('../form-pages/utils')
jest.mock('../utils/applications/getApplicationData')

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

  describe('save', () => {
    const application = applicationFactory.build({ data: null })
    const token = 'some-token'
    const request = createMock<Request>({
      params: { id: application.id, task: 'some-task', page: 'some-page' },
      user: { token },
    })
    const applicationData = createMock<UpdateCas2Application>()

    beforeEach(() => {
      applicationClient.find.mockResolvedValue(application)
    })

    describe('when there are no validation errors', () => {
      let page: DeepMocked<TaskListPage>

      beforeEach(() => {
        page = createMock<TaskListPage>({
          errors: () => {
            return {} as TaskListErrors<TaskListPage>
          },
          body: { foo: 'bar' },
        })
        ;(getPageName as jest.Mock).mockReturnValue('some-page')
        ;(getTaskName as jest.Mock).mockReturnValue('some-task')
      })

      it('does not throw an error', () => {
        expect(async () => {
          await service.save(page, request)
        }).not.toThrow(ValidationError)
      })

      it('saves data to the api', async () => {
        await service.save(page, request)

        expect(applicationClientFactory).toHaveBeenCalledWith(token)
        expect(applicationClient.update).toHaveBeenCalledWith(application.id, applicationData)
      })

      it('updates an in-progress application', async () => {
        application.data = { 'some-task': { 'other-page': { question: 'answer' } } }

        await service.save(page, request)

        expect(getApplicationUpdateData).toHaveBeenCalledWith({
          ...application,
          data: {
            'some-task': {
              'other-page': { question: 'answer' },
              'some-page': { foo: 'bar' },
            },
          },
        })
      })
    })

    describe('When there validation errors', () => {
      it('throws an error if there is a validation error', async () => {
        const errors = createMock<TaskListErrors<TaskListPage>>({ knowOralHearingDate: 'error' })
        const page = createMock<TaskListPage>({
          errors: () => errors,
        })

        expect.assertions(1)
        try {
          await service.save(page, request)
        } catch (e) {
          expect(e).toEqual(new ValidationError(errors))
        }
      })
    })
  })
})
