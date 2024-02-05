import { Request, RequestHandler, Response } from 'express'
import { FullPerson } from '@approved-premises/api'
import SubmittedApplicationService from '../../services/submittedApplicationService'
import paths from '../../paths/assess'
import { catchValidationErrorOrPropogate, fetchErrorsAndUserInput } from '../../utils/validation'
import { camelToKebabCase } from '../../utils/utils'

export default class StatusUpdateController {
  constructor(private readonly submittedApplicationService: SubmittedApplicationService) {}

  new(): RequestHandler {
    return async (req: Request, res: Response) => {
      const { errors, errorSummary } = fetchErrorsAndUserInput(req)

      const application = await this.submittedApplicationService.findApplication(req.user.token, req.params.id)
      const person = application.person as FullPerson
      const currentStatus = application.statusUpdates.length ? application.statusUpdates[0].label : 'Received'

      const statuses = await this.submittedApplicationService.getApplicationStatuses(req.user.token)

      const previousPath = req.headers.referer

      return res.render('assess/statusUpdate/new', {
        application,
        person,
        currentStatus,
        statuses,
        previousPath,
        errors,
        errorSummary,
        pageHeading: `What is the latest status of the application?`,
        questionText: `What is the latest status of ${person.name}'s application?`,
      })
    }
  }

  create(): RequestHandler {
    return async (req: Request, res: Response) => {
      const applicationId = req.params.id
      const { newStatus } = req.body

      try {
        const statuses = await this.submittedApplicationService.getApplicationStatuses(req.user.token)

        const hasStatusDetails = statuses.some(
          status => Boolean(status.statusDetails?.length) && status.name === newStatus,
        )

        if (hasStatusDetails) {
          return res.redirect(
            paths.statusUpdateDetails.new({ id: applicationId, statusName: camelToKebabCase(newStatus) }),
          )
        }

        await this.submittedApplicationService.updateApplicationStatus(req.user.token, applicationId, { newStatus })
        return res.redirect(paths.submittedApplications.overview({ id: applicationId }))
      } catch (err) {
        return catchValidationErrorOrPropogate(req, res, err, paths.statusUpdate.new({ id: applicationId }))
      }
    }
  }
}
