import { Request, RequestHandler, Response } from 'express'
import { FullPerson } from '@approved-premises/api'
import SubmittedApplicationService from '../../services/submittedApplicationService'

export default class SubmittedApplicationsController {
  constructor(private readonly submittedApplicationService: SubmittedApplicationService) {}

  show(): RequestHandler {
    return async (req: Request, res: Response) => {
      const application = await this.submittedApplicationService.findApplication(req.user.token, req.params.id)
      const person = application.person as FullPerson

      return res.render('assess/applications/show', {
        application,
        pageHeading: `Application for ${person.nomsNumber}`,
      })
    }
  }
}
