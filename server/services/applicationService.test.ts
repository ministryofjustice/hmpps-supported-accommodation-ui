import { DeepMocked, createMock } from '@golevelup/ts-jest'
import type { Request } from 'express'
import { SubmitCas2Application } from '@approved-premises/api'
import { UpdateCas2Application } from 'server/@types/shared/models/UpdateCas2Application'
import { DataServices, GroupedApplications, TaskListErrors } from '@approved-premises/ui'
import ApplicationService from './applicationService'
import ApplicationClient from '../data/applicationClient'
import TaskListPage, { TaskListPageInterface } from '../form-pages/taskListPage'
import { getBody, getPageName, getTaskName } from '../form-pages/utils'
import { ValidationError } from '../utils/errors'
import { getApplicationSubmissionData, getApplicationUpdateData } from '../utils/applications/getApplicationData'

import { applicationFactory, applicationSummaryFactory } from '../testutils/factories'

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

  describe('getAllForLoggedInUser', () => {
    const token = 'SOME_TOKEN'
    const applications: GroupedApplications = {
      inProgress: applicationSummaryFactory.buildList(1, { status: 'inProgress' }),
    }

    it('fetches all applications', async () => {
      applicationClient.all.mockResolvedValue(Object.values(applications).flat())

      const result = await service.getAllForLoggedInUser(token)

      expect(result).toEqual({
        inProgress: applications.inProgress,
      })

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

  describe('appendToList', () => {
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
          await service.appendToList(page, request)
        }).not.toThrow(ValidationError)
      })

      it('saves data to the api', async () => {
        await service.appendToList(page, request)

        expect(applicationClientFactory).toHaveBeenCalledWith(token)
        expect(applicationClient.update).toHaveBeenCalledWith(application.id, applicationData)
      })

      it('updates an in-progress application', async () => {
        application.data = { 'some-task': { 'some-page': [{ question: 'answer' }] } }
        const requestWithBody = createMock<Request>({
          body: { newQuestion: 'new answer' },
          params: { id: application.id, task: 'some-task', page: 'some-page' },
          user: { token },
        })

        await service.appendToList(page, requestWithBody)

        expect(getApplicationUpdateData).toHaveBeenCalledWith({
          ...application,
          data: {
            'some-task': {
              'some-page': [{ question: 'answer' }, { newQuestion: 'new answer' }],
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
          await service.appendToList(page, request)
        } catch (e) {
          expect(e).toEqual(new ValidationError(errors))
        }
      })
    })
  })

  describe('initializePage', () => {
    let request: DeepMocked<Request>

    const dataServices = createMock<DataServices>({}) as DataServices
    const application = applicationFactory.build()
    const Page = jest.fn()

    beforeEach(() => {
      applicationClient.find.mockResolvedValue(application)

      request = createMock<Request>({
        params: { id: application.id, task: 'my-task', page: 'first' },
        session: { previousPage: '' },
        user: { token: 'some-token' },
      })
    })

    it('should fetch the application from the API if it is not in the session', async () => {
      ;(getBody as jest.Mock).mockReturnValue(request.body)

      const result = await service.initializePage(Page, request, dataServices)

      expect(result).toBeInstanceOf(Page)

      expect(Page).toHaveBeenCalledWith(request.body, application, '')
      expect(applicationClient.find).toHaveBeenCalledWith(request.params.id)
    })

    it('should return the session and a page from a page list', async () => {
      ;(getBody as jest.Mock).mockReturnValue(request.body)

      const result = await service.initializePage(Page, request, dataServices)

      expect(result).toBeInstanceOf(Page)

      expect(Page).toHaveBeenCalledWith(request.body, application, '')
    })

    it('should initialize the page with the session and the userInput if specified', async () => {
      const userInput = { foo: 'bar' }
      ;(getBody as jest.Mock).mockReturnValue(userInput)

      const result = await service.initializePage(Page, request, dataServices, userInput)

      expect(result).toBeInstanceOf(Page)

      expect(Page).toHaveBeenCalledWith(userInput, application, '')
    })

    it('should load from the application if the body and userInput are blank', async () => {
      const data = { 'my-task': { first: { foo: 'bar' } } }
      const applicationWithData = {
        ...application,
        data,
      }
      request.body = {}
      applicationClient.find.mockResolvedValue(applicationWithData)
      ;(getBody as jest.Mock).mockReturnValue(data['my-task'].first)

      const result = await service.initializePage(Page, request, dataServices)

      expect(result).toBeInstanceOf(Page)

      expect(Page).toHaveBeenCalledWith({ foo: 'bar' }, applicationWithData, '')
    })

    it("should call a service's initialize method if it exists", async () => {
      const OtherPage = { initialize: jest.fn() } as unknown as TaskListPageInterface
      ;(getBody as jest.Mock).mockReturnValue(request.body)

      await service.initializePage(OtherPage, request, dataServices)

      expect(OtherPage.initialize).toHaveBeenCalledWith(request.body, application, request.user.token, dataServices)
    })

    it("retrieve the 'previousPage' value from the session and call the Page object's constructor with that value", async () => {
      ;(getBody as jest.Mock).mockReturnValue(request.body)

      request.session.previousPage = 'previous-page-name'
      await service.initializePage(Page, request, dataServices)

      expect(Page).toHaveBeenCalledWith(request.body, application, 'previous-page-name')
    })
  })

  describe('submit', () => {
    it('calls the submit method', async () => {
      const application = applicationFactory.build()
      const applicationData = createMock<SubmitCas2Application>()
      const token = 'SOME_TOKEN'

      applicationClient.submit.mockImplementation(() => Promise.resolve())
      ;(getApplicationSubmissionData as jest.Mock).mockReturnValue(applicationData)

      await service.submit(token, application)

      expect(applicationClientFactory).toHaveBeenCalledWith(token)
      expect(applicationClient.submit).toHaveBeenCalledWith(application.id, applicationData)
    })
  })

  describe('saveData', () => {
    it('updates the application data', async () => {
      const application = applicationFactory.build({ data: null })
      applicationClient.find.mockResolvedValue(application)

      const token = 'some-token'
      const request = createMock<Request>({
        params: { id: application.id, task: 'some-task', page: 'some-page' },
        user: { token },
      })

      const applicationData = createMock<UpdateCas2Application>()

      const newApplicationData = { 'risk-to-self': { vulnerability: { vulnerabilityDetail: 'example' } } }

      await service.saveData(newApplicationData, request)

      expect(applicationClientFactory).toHaveBeenCalledWith(token)
      expect(getApplicationUpdateData).toHaveBeenCalledWith({
        ...application,
        data: newApplicationData,
      })
      expect(applicationClient.update).toHaveBeenCalledWith(application.id, applicationData)
    })
  })
})
