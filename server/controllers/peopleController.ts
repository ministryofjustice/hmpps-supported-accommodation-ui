import type { Request, RequestHandler, Response } from 'express'
import paths from '../paths/apply'
import { errorMessage, errorSummary } from '../utils/validation'
import PersonService from '../services/personService'
import ApplicationService from '../services/applicationService'

export default class PeopleController {
  constructor(private readonly applicationService: ApplicationService, private readonly personService: PersonService) {}

  find(): RequestHandler {
    return async (req: Request, res: Response) => {
      const { crn } = req.body

      if (crn) {
        try {
          const person = await this.personService.findByCrn(req.user.token, crn)
          const application = await this.applicationService.createApplication(req.user.token, person.crn)

          req.session.application = application

          res.redirect(paths.applications.show({ id: application.id }))
        } catch (err) {
          if (err.status === 404) {
            this.addErrorMessagesToFlash(req, `No person with a CRN of '${crn}' was found`)
          } else if (err.status === 403) {
            this.addErrorMessagesToFlash(req, 'You do not have permission to access this CRN')
          } else {
            throw err
          }

          res.redirect(req.headers.referer)
        }
      } else {
        this.addErrorMessagesToFlash(req, 'You must enter a CRN')
        res.redirect(req.headers.referer)
      }
    }
  }

  addErrorMessagesToFlash(request: Request, message: string) {
    request.flash('errors', {
      crn: errorMessage('crn', message),
    })
    request.flash('errorSummary', [errorSummary('crn', message)])
    request.flash('userInput', request.body)
  }
}
