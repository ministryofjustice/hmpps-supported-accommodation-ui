import type { NextFunction, Request, Response } from 'express'
import { DeepMocked, createMock } from '@golevelup/ts-jest'
import { Cas2Application as Application } from '@approved-premises/api'
import { ErrorsAndUserInput } from '@approved-premises/ui'

import { applicationFactory } from '../../testutils/factories'
import { fetchErrorsAndUserInput } from '../../utils/validation'
import ApplicationsController from './applicationsController'
import { PersonService, ApplicationService, TaskListService } from '../../services'
import paths from '../../paths/apply'

jest.mock('../../utils/validation')
jest.mock('../../services/taskListService')

describe('applicationsController', () => {
  const token = 'SOME_TOKEN'

  let request: DeepMocked<Request> = createMock<Request>({ user: { token } })
  let response: DeepMocked<Response> = createMock<Response>({})
  const next: DeepMocked<NextFunction> = jest.fn()

  const personService = createMock<PersonService>({})
  const applicationService = createMock<ApplicationService>({})

  let applicationsController: ApplicationsController

  const applications = applicationFactory.buildList(3)

  applicationService.getAllApplications.mockResolvedValue(applications)

  beforeEach(() => {
    applicationsController = new ApplicationsController(personService, applicationService)
    request = createMock<Request>({ user: { token } })
    response = createMock<Response>({})
    jest.clearAllMocks()
  })

  describe('new', () => {
    it('renders existing applications and the crn form', async () => {
      ;(fetchErrorsAndUserInput as jest.Mock).mockImplementation(() => {
        return { errors: {}, errorSummary: [], userInput: {} }
      })

      const requestHandler = applicationsController.new()

      await requestHandler(request, response, next)

      expect(response.render).toHaveBeenCalledWith('applications/new', {
        pageHeading: "Enter the person's CRN",
        errors: {},
        errorSummary: [],
        applications,
      })
    })

    it('renders the form with errors and user input if an error has been sent to the flash', async () => {
      const errorsAndUserInput = createMock<ErrorsAndUserInput>()
      ;(fetchErrorsAndUserInput as jest.Mock).mockReturnValue(errorsAndUserInput)

      const requestHandler = applicationsController.new()
      await requestHandler(request, response, next)

      expect(response.render).toHaveBeenCalledWith('applications/new', {
        pageHeading: "Enter the person's CRN",
        errors: errorsAndUserInput.errors,
        errorSummary: errorsAndUserInput.errorSummary,
        ...errorsAndUserInput.userInput,
        applications,
      })
    })
  })

  describe('show', () => {
    it('renders the task list view', async () => {
      const application = applicationFactory.build()
      const stubTaskList = jest.fn()
      applicationService.findApplication.mockResolvedValue(application)
      ;(TaskListService as jest.Mock).mockImplementation(() => {
        return stubTaskList
      })

      const requestHandler = applicationsController.show()
      await requestHandler(request, response, next)

      expect(response.render).toHaveBeenCalledWith('applications/taskList', {
        application,
        taskList: stubTaskList,
      })
    })
  })

  describe('create', () => {
    it('redirects to the new applications page on success', async () => {
      request.body = {
        crn: '12345',
      }

      applicationService.createApplication.mockResolvedValue({} as Application)

      const requestHandler = applicationsController.create()
      await requestHandler(request, response, next)

      expect(response.redirect).toHaveBeenCalledWith(paths.applications.new({}))
    })

    it('throws an error if createApplication returns error', async () => {
      const requestHandler = applicationsController.create()

      const err = new Error()

      applicationService.createApplication.mockImplementation(() => {
        throw err
      })

      request.body.crn = '12345'

      expect(async () => requestHandler(request, response, next)).rejects.toThrow(err)
    })
  })
})
