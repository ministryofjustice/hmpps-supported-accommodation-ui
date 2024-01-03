import { Request, RequestHandler, Response } from 'express'
import { DataServices } from '@approved-premises/ui'
import { Cas2Application } from '@approved-premises/api'
import PersonService from '../../services/personService'
import {
  catchValidationErrorOrPropogate,
  errorMessage,
  errorSummary as buildErrorSummary,
  fetchErrorsAndUserInput,
} from '../../utils/validation'
import ApplicationService from '../../services/applicationService'
import {
  eligibilityIsDenied,
  eligibilityIsConfirmed,
  firstPageOfBeforeYouStartSection,
  firstPageOfConsentTask,
  consentIsConfirmed,
  consentIsDenied,
} from '../../utils/applications/utils'
import TaskListService from '../../services/taskListService'
import paths from '../../paths/apply'
import { getPage } from '../../utils/applications/getPage'
import { nameOrPlaceholderCopy } from '../../utils/utils'
import { buildDocument } from '../../utils/applications/documentUtils'

export default class ApplicationsController {
  constructor(
    private readonly _personService: PersonService,
    private readonly applicationService: ApplicationService,
    private readonly dataServices: DataServices,
  ) {}

  index(): RequestHandler {
    return async (req: Request, res: Response) => {
      const applications = await this.applicationService.getAllForLoggedInUser(req.user.token)

      const { errors, errorSummary, userInput } = fetchErrorsAndUserInput(req)

      return res.render('applications/index', {
        errors,
        errorSummary,
        ...userInput,
        applications,
        pageHeading: 'Applications',
      })
    }
  }

  show(): RequestHandler {
    return async (req: Request, res: Response) => {
      const application = await this.applicationService.findApplication(req.user.token, req.params.id)

      if (application.submittedAt) {
        return res.render('applications/show', { application })
      }

      if (eligibilityIsConfirmed(application)) {
        if (consentIsConfirmed(application)) {
          const { errors, errorSummary } = fetchErrorsAndUserInput(req)

          const referrer = req.headers.referer
          const taskList = new TaskListService(application)
          return res.render('applications/taskList', { application, taskList, errors, errorSummary, referrer })
        }
        if (consentIsDenied(application)) {
          return res.render('applications/consent-refused', this.consentRefusedViewParams(application, req))
        }
        return res.redirect(firstPageOfConsentTask(application))
      }

      if (eligibilityIsDenied(application)) {
        return res.render('applications/ineligible', this.ineligibleViewParams(application))
      }

      return res.redirect(firstPageOfBeforeYouStartSection(application))
    }
  }

  private ineligibleViewParams(application: Cas2Application): Record<string, string | Cas2Application> {
    const panelText = `${nameOrPlaceholderCopy(
      application.person,
      'The person',
    )} is not eligible for CAS-2 accommodation`
    const changeAnswerPath = paths.applications.pages.show({
      id: application.id,
      task: 'confirm-eligibility',
      page: 'confirm-eligibility',
    })
    const newApplicationPath = paths.applications.new({})
    return { application, panelText, changeAnswerPath, newApplicationPath }
  }

  private consentRefusedViewParams(
    application: Cas2Application,
    req: Request,
  ): Record<string, string | Cas2Application> {
    const panelText = `${nameOrPlaceholderCopy(application.person, 'The person')} has not given their consent`
    const changeAnswerPath = paths.applications.pages.show({
      id: application.id,
      task: 'confirm-consent',
      page: 'confirm-consent',
    })
    const newApplicationPath = paths.applications.new({})
    const backLink = req.headers.referer
    return { application, panelText, changeAnswerPath, newApplicationPath, backLink }
  }

  create(): RequestHandler {
    return async (req: Request, res: Response) => {
      const { crn, prisonNumber } = req.body

      try {
        const application = await this.applicationService.createApplication(req.user.token, crn)

        res.redirect(paths.applications.show({ id: application.id }))
      } catch (err) {
        if (err.status === 404) {
          this.addErrorMessagesToFlash(
            req,
            `No person found for prison number ${prisonNumber}, please try another number.`,
          )
        } else if (err.status === 403) {
          this.addErrorMessagesToFlash(
            req,
            `You do not have permission to access the prison number ${prisonNumber}, please try another number.`,
          )
        } else {
          this.addErrorMessagesToFlash(req, 'There was an error creating the application, please try again.')
        }

        res.redirect(paths.applications.new({}))
      }
    }
  }

  addErrorMessagesToFlash(request: Request, message: string) {
    request.flash('errors', {
      prisonNumber: errorMessage('prisonNumber', message),
    })
    request.flash('errorSummary', [buildErrorSummary('prisonNumber', message)])
    request.flash('userInput', request.body)
  }

  new(): RequestHandler {
    return async (req: Request, res: Response) => {
      const { errors, errorSummary, userInput } = fetchErrorsAndUserInput(req)

      return res.render('applications/new', {
        errors,
        errorSummary,
        ...userInput,
        pageHeading: "Enter the person's prison number",
      })
    }
  }

  submit(): RequestHandler {
    return async (req: Request, res: Response) => {
      const application = await this.applicationService.findApplication(req.user.token, req.params.id)
      application.document = buildDocument(application)

      try {
        await this.applicationService.submit(req.user.token, application)
        res.render('applications/confirm', { pageHeading: 'Application confirmation', application })
      } catch (err) {
        err.data = { detail: err.message }
        catchValidationErrorOrPropogate(req, res, err, paths.applications.show({ id: application.id }))
      }
    }
  }

  update(): RequestHandler {
    return async (req: Request, res: Response) => {
      const { taskData, pageName, taskName } = req.body
      const Page = getPage(taskName, pageName, 'applications')
      const page = await this.applicationService.initializePage(Page, req, this.dataServices)
      const data = JSON.parse(taskData)

      try {
        await this.applicationService.saveData(data, req)
        const next = page.next()
        if (next) {
          res.redirect(paths.applications.pages.show({ id: req.params.id, task: taskName, page: page.next() }))
        } else {
          res.redirect(paths.applications.show({ id: req.params.id }))
        }
      } catch (err) {
        catchValidationErrorOrPropogate(
          req,
          res,
          err,
          paths.applications.pages.show({ id: req.params.id, task: taskName, page: pageName }),
        )
      }
    }
  }

  appendToList() {
    return async (req: Request, res: Response) => {
      const { id, page: pageName, task: taskName } = req.params
      const { redirectPage } = req.query
      const Page = getPage(taskName, pageName, 'applications')
      const page = await this.applicationService.initializePage(Page, req, this.dataServices)

      try {
        await this.applicationService.appendToList(page, req)
        const next = page.next()
        req.flash('success', 'Form updated')
        if (redirectPage) {
          res.redirect(paths.applications.pages.show({ id, task: taskName, page: redirectPage as string }))
        } else if (next) {
          res.redirect(paths.applications.pages.show({ id, task: taskName, page: page.next() }))
        } else {
          res.redirect(paths.applications.show({ id }))
        }
      } catch (err) {
        catchValidationErrorOrPropogate(
          req,
          res,
          err,
          paths.applications.pages.show({ id, task: taskName, page: pageName }),
        )
      }
    }
  }

  removeFromList() {
    return async (req: Request, res: Response) => {
      const { id, task } = req.params
      const { redirectPage } = req.query

      try {
        await this.applicationService.removeFromList(req)
      } catch (err) {
        catchValidationErrorOrPropogate(
          req,
          res,
          err,
          paths.applications.pages.show({ id, task, page: redirectPage as string }),
        )
      }
      return res.redirect(paths.applications.pages.show({ id, task, page: redirectPage as string }))
    }
  }
}
