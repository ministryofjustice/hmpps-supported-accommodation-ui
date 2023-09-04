import { Request, RequestHandler, Response } from 'express'
import { DataServices } from '@approved-premises/ui'
import { Cas2Application } from '@approved-premises/api'
import PersonService from '../../services/personService'
import { catchValidationErrorOrPropogate, fetchErrorsAndUserInput } from '../../utils/validation'
import ApplicationService from '../../services/applicationService'
import {
  eligibilityIsDenied,
  eligibilityIsConfirmed,
  firstPageOfBeforeYouStartSection,
} from '../../utils/applications/utils'
import TaskListService from '../../services/taskListService'
import paths from '../../paths/apply'
import { getResponses } from '../../utils/applications/getResponses'
import { getPage } from '../../utils/applications/getPage'
import { nameOrPlaceholderCopy } from '../../utils/utils'

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

      if (eligibilityIsConfirmed(application)) {
        const taskList = new TaskListService(application)
        return res.render('applications/taskList', { application, taskList })
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

  create(): RequestHandler {
    return async (req: Request, res: Response) => {
      const { crn } = req.body

      await this.applicationService.createApplication(req.user.token, crn)

      return res.redirect(paths.applications.new({}))
    }
  }

  new(): RequestHandler {
    return async (req: Request, res: Response) => {
      const { errors, errorSummary, userInput } = fetchErrorsAndUserInput(req)

      return res.render('applications/new', {
        errors,
        errorSummary,
        ...userInput,
        pageHeading: "Enter the person's CRN",
      })
    }
  }

  submit(): RequestHandler {
    return async (req: Request, res: Response) => {
      const application = await this.applicationService.findApplication(req.user.token, req.params.id)
      application.document = getResponses(application)

      // TODO: validate that the user has confirmed information is complete
      // if (req.body?.confirmation !== 'submit') {
      //   addErrorMessageToFlash(
      //     req,
      //     'You must confirm the information provided is complete, accurate and up to date.',
      //     'confirmation',
      //   )
      //   return res.redirect(paths.applications.show({ id: application.id }))
      // }

      await this.applicationService.submit(req.user.token, application)
      return res.render('applications/confirm', { pageHeading: 'Application confirmation' })
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
      const { pageName, taskName } = req.body
      const Page = getPage(taskName, pageName, 'applications')
      const page = await this.applicationService.initializePage(Page, req, this.dataServices)

      try {
        await this.applicationService.appendToList(page, req)
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
}
