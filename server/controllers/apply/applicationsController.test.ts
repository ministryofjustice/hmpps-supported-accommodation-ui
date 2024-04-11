import type { NextFunction, Request, Response } from 'express'
import { DeepMocked, createMock } from '@golevelup/ts-jest'
import { Cas2Application as Application } from '@approved-premises/api'
import { ErrorsAndUserInput, GroupedApplications } from '@approved-premises/ui'
import createHttpError from 'http-errors'

import { getPage } from '../../utils/applications/getPage'
import TaskListPage from '../../form-pages/taskListPage'
import {
  applicationFactory,
  applicationSummaryFactory,
  personFactory,
  applicationNoteFactory,
} from '../../testutils/factories'
import {
  catchValidationErrorOrPropogate,
  fetchErrorsAndUserInput,
  errorMessage,
  errorSummary as errorSummaryMock,
} from '../../utils/validation'
import ApplicationsController from './applicationsController'
import { PersonService, ApplicationService, SubmittedApplicationService } from '../../services'
import paths from '../../paths/apply'
import { buildDocument } from '../../utils/applications/documentUtils'
import config from '../../config'
import { showMissingRequiredTasksOrTaskList, generateSuccessMessage } from '../../utils/applications/utils'
import { validateReferer } from '../../utils/viewUtils'

jest.mock('../../utils/validation')
jest.mock('../../services/taskListService')
jest.mock('../../utils/applications/getPage')
jest.mock('../../utils/applications/documentUtils')
jest.mock('../../utils/applications/utils')
jest.mock('../../utils/viewUtils')

describe('applicationsController', () => {
  const token = 'SOME_TOKEN'

  let request: DeepMocked<Request> = createMock<Request>({ user: { token } })
  let response: DeepMocked<Response> = createMock<Response>({})
  const next: DeepMocked<NextFunction> = jest.fn()

  const personService = createMock<PersonService>({})
  const applicationService = createMock<ApplicationService>({})
  const submittedApplicationService = createMock<SubmittedApplicationService>({})

  let applicationsController: ApplicationsController

  const applications = { inProgress: applicationSummaryFactory.buildList(3), submitted: [] } as GroupedApplications

  applicationService.getAllForLoggedInUser.mockResolvedValue(applications)

  beforeEach(() => {
    applicationsController = new ApplicationsController(
      personService,
      applicationService,
      submittedApplicationService,
      {
        personService,
        applicationService,
      },
    )

    request = createMock<Request>({
      user: { token },
      headers: {
        referer: 'some-referer/',
      },
    })
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
    describe('when application is submitted', () => {
      it('renders the submitted view', async () => {
        const submittedApplication = applicationFactory.build({ submittedAt: new Date().toISOString() })
        applicationService.findApplication.mockResolvedValue(submittedApplication)

        const requestHandler = applicationsController.show()
        await requestHandler(request, response, next)

        expect(response.render).toHaveBeenCalledWith('applications/show', {
          application: submittedApplication,
        })
      })
    })

    describe('when application is not submitted', () => {
      it('calls showMissingRequiredTasksOrTaskList', async () => {
        ;(showMissingRequiredTasksOrTaskList as jest.Mock).mockImplementation(jest.fn())
        const unsubmittedApplication = applicationFactory.build({})
        applicationService.findApplication.mockResolvedValue(unsubmittedApplication)

        const requestHandler = applicationsController.show()
        await requestHandler(request, response, next)

        expect(showMissingRequiredTasksOrTaskList).toHaveBeenCalledWith(request, response, unsubmittedApplication)
      })
    })
  })

  describe('overview', () => {
    const priorConfigFlags = config.flags

    afterAll(() => {
      config.flags = priorConfigFlags
    })

    const submittedApplication = applicationFactory.build({
      person: personFactory.build({ name: 'Roger Smith' }),
      submittedAt: '2024-02-05',
    })

    it('renders the overview page', async () => {
      ;(fetchErrorsAndUserInput as jest.Mock).mockImplementation(() => {
        return { errors: {}, errorSummary: [], userInput: {} }
      })

      applicationService.findApplication.mockResolvedValue(submittedApplication)

      const requestHandler = applicationsController.overview()
      await requestHandler(request, response, next)

      expect(response.render).toHaveBeenCalledWith('applications/overview', {
        application: submittedApplication,
        status: 'Received',
        pageHeading: 'Overview of application',
        errors: {},
        errorSummary: [],
      })
    })

    it('redirects to application show page if application has not been submitted', async () => {
      const application = applicationFactory.build({
        person: personFactory.build({ name: 'Roger Smith' }),
      })

      applicationService.findApplication.mockResolvedValue(application)

      const requestHandler = applicationsController.overview()
      await requestHandler(request, response, next)

      expect(response.redirect).toHaveBeenCalledWith(
        paths.applications.show({
          id: application.id,
        }),
      )
    })
  })

  describe('ineligible', () => {
    it('renders the ineligible page', async () => {
      const application = applicationFactory.build({
        person: personFactory.build({ name: 'Roger Smith' }),
      })

      const panelText = `Roger Smith is not eligible for CAS-2 accommodation`
      const changeAnswerPath = paths.applications.pages.show({
        id: application.id,
        task: 'confirm-eligibility',
        page: 'confirm-eligibility',
      })
      const newApplicationPath = paths.applications.new({})

      applicationService.findApplication.mockResolvedValue(application)

      const requestHandler = applicationsController.ineligible()
      await requestHandler(request, response, next)

      expect(response.render).toHaveBeenCalledWith('applications/ineligible', {
        application,
        panelText,
        changeAnswerPath,
        newApplicationPath,
      })
    })
  })

  describe('consentRefused', () => {
    it('renders the consent refused page', async () => {
      ;(validateReferer as jest.MockedFunction<typeof validateReferer>).mockReturnValue('some-validated-referer')
      const application = applicationFactory.build({
        person: personFactory.build({ name: 'Roger Smith' }),
      })

      const panelText = `Roger Smith has not given their consent`
      const changeAnswerPath = paths.applications.pages.show({
        id: application.id,
        task: 'confirm-consent',
        page: 'confirm-consent',
      })
      const newApplicationPath = paths.applications.new({})

      applicationService.findApplication.mockResolvedValue(application)

      const requestHandler = applicationsController.consentRefused()
      await requestHandler(request, response, next)

      expect(response.render).toHaveBeenCalledWith('applications/consent-refused', {
        application,
        panelText,
        changeAnswerPath,
        newApplicationPath,
        backLink: 'some-validated-referer',
      })
      expect(validateReferer).toHaveBeenCalledWith('some-referer/')
    })
  })

  describe('create', () => {
    it('redirects to the new applications page on success', async () => {
      request.body = {
        crn: 'crn123',
        prisonNumber: 'prisonNumber123',
      }

      applicationService.createApplication.mockResolvedValue({} as Application)

      const requestHandler = applicationsController.create()
      await requestHandler(request, response, next)

      expect(response.redirect).toHaveBeenCalledWith(paths.applications.new({}))
    })

    it('handles a not found error if person not found', async () => {
      request.body = {
        crn: 'crn123',
        prisonNumber: 'prisonNumber123',
      }

      const requestHandler = applicationsController.create()

      const err = createHttpError(404)

      applicationService.createApplication.mockImplementation(() => {
        throw err
      })

      await requestHandler(request, response, next)

      expect(errorSummaryMock).toHaveBeenCalledWith(
        'prisonNumber',
        'No person found for prison number prisonNumber123, please try another number.',
      )

      expect(errorMessage).toHaveBeenCalledWith(
        'prisonNumber',
        'No person found for prison number prisonNumber123, please try another number.',
      )

      expect(response.redirect).toHaveBeenCalledWith(paths.applications.new({}))
    })

    it('handles a forbidden error if person forbidden', async () => {
      request.body = {
        crn: 'crn123',
        prisonNumber: 'prisonNumber123',
      }

      const requestHandler = applicationsController.create()

      const err = createHttpError(403)

      applicationService.createApplication.mockImplementation(() => {
        throw err
      })

      await requestHandler(request, response, next)

      expect(errorSummaryMock).toHaveBeenCalledWith(
        'prisonNumber',
        'You do not have permission to access the prison number prisonNumber123, please try another number.',
      )

      expect(errorMessage).toHaveBeenCalledWith(
        'prisonNumber',
        'You do not have permission to access the prison number prisonNumber123, please try another number.',
      )

      expect(response.redirect).toHaveBeenCalledWith(paths.applications.new({}))
    })

    it('throws a generic error if createApplication returns server error', async () => {
      const requestHandler = applicationsController.create()

      const err = new Error()

      applicationService.createApplication.mockImplementation(() => {
        throw err
      })

      await requestHandler(request, response, next)

      expect(response.redirect).toHaveBeenCalledWith(paths.applications.new({}))
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
        pageHeading: "Enter the person's prison number",
      })
    })

    it('renders the form with errors and user input if an error has been sent to the flash', async () => {
      const errorsAndUserInput = createMock<ErrorsAndUserInput>()
      ;(fetchErrorsAndUserInput as jest.Mock).mockReturnValue(errorsAndUserInput)

      const requestHandler = applicationsController.new()
      await requestHandler(request, response, next)

      expect(response.render).toHaveBeenCalledWith('applications/new', {
        pageHeading: "Enter the person's prison number",
        errors: errorsAndUserInput.errors,
        errorSummary: errorsAndUserInput.errorSummary,
        ...errorsAndUserInput.userInput,
      })
    })
  })

  describe('submit', () => {
    it('renders the application submission confirmation page', async () => {
      const application = applicationFactory.build()

      ;(buildDocument as jest.Mock).mockReturnValue({})

      request.params.id = 'some-id'

      applicationService.findApplication.mockResolvedValue(application)

      const requestHandler = applicationsController.submit()
      await requestHandler(request, response, next)

      expect(applicationService.findApplication).toHaveBeenCalledWith(request.user.token, request.params.id)
      expect(applicationService.submit).toHaveBeenCalledWith(request.user.token, application)
      expect(response.render).toHaveBeenCalledWith('applications/confirm', {
        pageHeading: 'Application confirmation',
        application,
      })
    })

    describe('when an error occurs', () => {
      it('passes error to error handler', async () => {
        const err = new Error()
        applicationService.submit.mockImplementation(() => {
          throw err
        })

        const application = applicationFactory.build()

        ;(buildDocument as jest.Mock).mockReturnValue({})

        request.params.id = 'some-id'

        applicationService.findApplication.mockResolvedValue(application)

        const requestHandler = applicationsController.submit()
        await requestHandler(request, response, next)

        expect(catchValidationErrorOrPropogate).toHaveBeenCalledWith(
          request,
          response,
          err,
          paths.applications.show({ id: application.id }),
        )
      })
    })
  })

  describe('appendToList', () => {
    const page = createMock<TaskListPage>({})

    beforeEach(() => {
      request.body = {
        exampleField: 'example answer',
      }
      request.query = {}
      request.params = {
        id: 'abc123',
        page: 'example-page',
        task: 'example-task',
      }
      request.flash = jest.fn()

      const PageConstructor = jest.fn()
      ;(getPage as jest.Mock).mockReturnValue(PageConstructor)

      applicationService.initializePage.mockResolvedValue(page)
    })

    describe('when there is a redirect path', () => {
      it('redirects to that path', async () => {
        request.query = {
          redirectPage: 'redirect-page',
        }

        applicationService.appendToList.mockResolvedValue()
        ;(generateSuccessMessage as jest.Mock).mockReturnValue('')

        const requestHandler = applicationsController.appendToList()

        await requestHandler({ ...request }, response)

        expect(applicationService.appendToList).toHaveBeenCalledWith(page, request)

        expect(request.flash).toHaveBeenCalledWith('success', '')

        expect(response.redirect).toHaveBeenCalledWith('/applications/abc123/tasks/example-task/pages/redirect-page')
      })
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

  describe('removeFromList', () => {
    const page = createMock<TaskListPage>({})

    beforeEach(() => {
      request.query = {
        redirectPage: 'return-page',
      }
      request.params = {
        id: 'abc123',
        task: 'example-task',
        page: 'example-page',
        index: '0',
      }

      const PageConstructor = jest.fn()
      ;(getPage as jest.Mock).mockReturnValue(PageConstructor)

      applicationService.initializePage.mockResolvedValue(page)
    })

    describe('when item is successfully removed', () => {
      it('renders the page', async () => {
        applicationService.removeFromList.mockResolvedValue()

        const requestHandler = applicationsController.removeFromList()

        await requestHandler({ ...request }, response)

        expect(applicationService.removeFromList).toHaveBeenCalledWith(request)

        expect(response.redirect).toHaveBeenCalledWith(
          paths.applications.pages.show({ id: request.params.id, task: 'example-task', page: 'return-page' }),
        )
      })
    })

    describe('when an error occurs', () => {
      it('passes error to error handler', async () => {
        const err = new Error()
        applicationService.removeFromList.mockImplementation(() => {
          throw err
        })

        const requestHandler = applicationsController.removeFromList()

        await requestHandler({ ...request }, response)

        expect(catchValidationErrorOrPropogate).toHaveBeenCalledWith(
          request,
          response,
          err,
          paths.applications.pages.show({ id: request.params.id, task: 'example-task', page: 'return-page' }),
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

  describe('addNote', () => {
    describe('when a note is added', () => {
      it('redirects to the overview page with a success message', async () => {
        request.params = {
          id: 'abc123',
        }
        request.body = { note: 'some notes' }

        const note = applicationNoteFactory.build()

        submittedApplicationService.addApplicationNote.mockImplementation(async () => note)

        const requestHandler = applicationsController.addNote()
        await requestHandler(request, response)

        expect(request.flash).toHaveBeenCalledWith('success', 'Your note was saved.')
        expect(response.redirect).toHaveBeenCalledWith(paths.applications.overview({ id: 'abc123' }))
      })
    })

    describe('when there is an error', () => {
      it('passes the error to the error handler', async () => {
        request.params = {
          id: 'abc123',
        }
        request.body = { note: 'some notes' }

        const err = new Error()
        submittedApplicationService.addApplicationNote.mockImplementation(() => {
          throw err
        })

        const requestHandler = applicationsController.addNote()
        await requestHandler(request, response)
        expect(catchValidationErrorOrPropogate).toHaveBeenCalledWith(
          request,
          response,
          err,
          paths.applications.overview({ id: 'abc123' }),
        )
      })
    })
  })

  describe('prisonDashboard', () => {
    it('renders the prison dashboard page', async () => {
      const requestHandler = applicationsController.prisonDashboard()

      await requestHandler(request, response, next)

      expect(response.render).toHaveBeenCalledWith('applications/prison-dashboard', {
        pageHeading: 'Applications for prison',
      })
    })
  })
})
