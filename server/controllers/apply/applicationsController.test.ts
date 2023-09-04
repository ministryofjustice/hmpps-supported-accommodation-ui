import type { NextFunction, Request, Response } from 'express'
import { DeepMocked, createMock } from '@golevelup/ts-jest'
import { Cas2Application as Application } from '@approved-premises/api'
import { ErrorsAndUserInput } from '@approved-premises/ui'

import { getPage } from '../../utils/applications/getPage'
import TaskListPage from '../../form-pages/taskListPage'
import { applicationFactory, personFactory } from '../../testutils/factories'
import { catchValidationErrorOrPropogate, fetchErrorsAndUserInput } from '../../utils/validation'
import ApplicationsController from './applicationsController'
import { PersonService, ApplicationService, TaskListService } from '../../services'
import paths from '../../paths/apply'
import { getResponses } from '../../utils/applications/getResponses'

jest.mock('../../utils/validation')
jest.mock('../../services/taskListService')
jest.mock('../../utils/applications/getResponses')
jest.mock('../../utils/applications/getPage')

describe('applicationsController', () => {
  const token = 'SOME_TOKEN'

  let request: DeepMocked<Request> = createMock<Request>({ user: { token } })
  let response: DeepMocked<Response> = createMock<Response>({})
  const next: DeepMocked<NextFunction> = jest.fn()

  const personService = createMock<PersonService>({})
  const applicationService = createMock<ApplicationService>({})

  let applicationsController: ApplicationsController

  const applications = { inProgress: applicationFactory.buildList(3) }

  applicationService.getAllForLoggedInUser.mockResolvedValue(applications)

  beforeEach(() => {
    applicationsController = new ApplicationsController(personService, applicationService, {
      personService,
      applicationService,
    })

    request = createMock<Request>({ user: { token } })
    response = createMock<Response>({})
  })

  describe('index', () => {
    it('renders existing applications', async () => {
      ;(fetchErrorsAndUserInput as jest.Mock).mockImplementation(() => {
        return { errors: {}, errorSummary: [], userInput: {} }
      })

      const requestHandler = applicationsController.index()

      await requestHandler(request, response, next)

      expect(response.render).toHaveBeenCalledWith('applications/index', {
        errors: {},
        errorSummary: [],
        applications,
        pageHeading: 'Applications',
      })
    })
  })

  describe('show', () => {
    describe('when "Confirm eligibility" task ("Before you start" section) is complete', () => {
      describe('and the person is confirmed eligible', () => {
        it('renders the task list view', async () => {
          const application = applicationFactory.build({
            data: {
              'confirm-eligibility': {
                'confirm-eligibility': { isEligible: 'yes' },
              },
            },
          })
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

      describe('and the person is confirmed INELIGIBLE', () => {
        it('renders the _ineligible_ page', async () => {
          const application = applicationFactory.build({
            person: personFactory.build({ name: 'Roger Smith' }),
            data: {
              'confirm-eligibility': {
                'confirm-eligibility': { isEligible: 'no' },
              },
            },
          })

          const panelText = `Roger Smith is not eligible for CAS-2 accommodation`
          const changeAnswerPath = paths.applications.pages.show({
            id: application.id,
            task: 'confirm-eligibility',
            page: 'confirm-eligibility',
          })
          const newApplicationPath = paths.applications.new({})

          applicationService.findApplication.mockResolvedValue(application)

          const requestHandler = applicationsController.show()
          await requestHandler(request, response, next)

          expect(response.render).toHaveBeenCalledWith('applications/ineligible', {
            application,
            panelText,
            changeAnswerPath,
            newApplicationPath,
          })
        })
      })
    })

    describe('when "Confirm eligibility" task is NOT complete', () => {
      it('renders "Confirm eligibility" page from the "Before you start" section', async () => {
        const application = applicationFactory.build({ data: {} })
        applicationService.findApplication.mockResolvedValue(application)

        const requestHandler = applicationsController.show()
        await requestHandler(request, response, next)

        expect(response.redirect).toHaveBeenCalledWith(
          paths.applications.pages.show({
            id: application.id,
            task: 'confirm-eligibility',
            page: 'confirm-eligibility',
          }),
        )
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

  describe('new', () => {
    it('renders the enter CRN template', async () => {
      ;(fetchErrorsAndUserInput as jest.Mock).mockImplementation(() => {
        return { errors: {}, errorSummary: [], userInput: {} }
      })

      const requestHandler = applicationsController.new()
      await requestHandler(request, response, next)

      expect(response.render).toHaveBeenCalledWith('applications/new', {
        errors: {},
        errorSummary: [],
        pageHeading: "Enter the person's CRN",
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
      })
    })
  })

  describe('submit', () => {
    it('renders the application submission confirmation page', async () => {
      const application = applicationFactory.build()
      request.params.id = 'some-id'
      applicationService.findApplication.mockResolvedValue(application)

      const requestHandler = applicationsController.submit()
      await requestHandler(request, response, next)

      expect(applicationService.findApplication).toHaveBeenCalledWith(request.user.token, request.params.id)
      expect(getResponses).toHaveBeenCalledWith(application)
      expect(response.render).toHaveBeenCalledWith('applications/confirm', { pageHeading: 'Application confirmation' })
    })
  })

  describe('appendToList', () => {
    const page = createMock<TaskListPage>({})

    beforeEach(() => {
      request.body = {
        exampleField: 'example answer',
        pageName: 'example-page',
        taskName: 'example-task',
      }
      request.params = {
        id: 'abc123',
      }

      const PageConstructor = jest.fn()
      ;(getPage as jest.Mock).mockReturnValue(PageConstructor)

      applicationService.initializePage.mockResolvedValue(page)
    })

    describe('when the page has a next page', () => {
      it('saves data and calls next function', async () => {
        page.next.mockReturnValue('next-page')

        applicationService.appendToList.mockResolvedValue()

        const requestHandler = applicationsController.appendToList()

        await requestHandler({ ...request }, response)

        expect(applicationService.appendToList).toHaveBeenCalledWith(page, request)

        expect(response.redirect).toHaveBeenCalledWith(
          paths.applications.pages.show({ id: request.params.id, task: 'example-task', page: 'next-page' }),
        )
      })
    })

    describe('when the page does not have a next page', () => {
      it('redirects to the task list page', async () => {
        page.next.mockReturnValue('')

        applicationService.appendToList.mockResolvedValue()

        const requestHandler = applicationsController.appendToList()

        await requestHandler({ ...request }, response)

        expect(applicationService.appendToList).toHaveBeenCalledWith(page, request)

        expect(response.redirect).toHaveBeenCalledWith(paths.applications.show({ id: request.params.id }))
      })
    })

    describe('when there are errors', () => {
      it('passes error to error handler', async () => {
        const err = new Error()
        applicationService.appendToList.mockImplementation(() => {
          throw err
        })

        const requestHandler = applicationsController.appendToList()

        await requestHandler({ ...request }, response)

        expect(catchValidationErrorOrPropogate).toHaveBeenCalledWith(
          request,
          response,
          err,
          paths.applications.pages.show({ id: request.params.id, task: 'example-task', page: 'example-page' }),
        )
      })
    })
  })

  describe('update', () => {
    const page = createMock<TaskListPage>({})

    const taskData = `{
      "example-task": {
        "example-page": {
          "exmaplePageQuestion": "example text"
        }
      }
    }`

    beforeEach(() => {
      request.body = {
        taskData,
        pageName: 'example-page',
        taskName: 'example-task',
      }

      request.params = {
        id: 'abc123',
      }

      const PageConstructor = jest.fn()
      ;(getPage as jest.Mock).mockReturnValue(PageConstructor)

      applicationService.initializePage.mockResolvedValue(page)
    })

    describe('when the page has a next page', () => {
      it('saves data and calls next function', async () => {
        page.next.mockReturnValue('next-page')

        applicationService.saveData.mockResolvedValue()

        const requestHandler = applicationsController.update()

        await requestHandler({ ...request }, response, next)

        expect(applicationService.saveData).toHaveBeenCalledWith(JSON.parse(taskData), request)

        expect(response.redirect).toHaveBeenCalledWith(
          paths.applications.pages.show({ id: request.params.id, task: 'example-task', page: 'next-page' }),
        )
      })
    })
    describe('when the page does not have a next page', () => {
      it('redirects to the task list page', async () => {
        page.next.mockReturnValue('')

        applicationService.saveData.mockResolvedValue()

        const requestHandler = applicationsController.update()

        await requestHandler({ ...request }, response, next)

        expect(applicationService.saveData).toHaveBeenCalledWith(JSON.parse(taskData), request)

        expect(response.redirect).toHaveBeenCalledWith(paths.applications.show({ id: request.params.id }))
      })
    })

    describe('when there are errors', () => {
      it('passes error to error handler', async () => {
        const err = new Error()
        applicationService.saveData.mockImplementation(() => {
          throw err
        })

        const requestHandler = applicationsController.update()

        await requestHandler({ ...request }, response, next)

        expect(catchValidationErrorOrPropogate).toHaveBeenCalledWith(
          request,
          response,
          err,
          paths.applications.pages.show({ id: request.params.id, task: 'example-task', page: 'example-page' }),
        )
      })
    })
  })
})
