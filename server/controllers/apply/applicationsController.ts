import { OASysSections } from '@approved-premises/api'
import { Request, RequestHandler, Response } from 'express'
import PersonService from '../../services/personService'

export default class ApplicationsController {
  constructor(private readonly personService: PersonService) {}

  new(): RequestHandler {
    return async (req: Request, res: Response) => {
      return res.render('applications/new', {
        pageHeading: "Enter the person's CRN",
      })
    }
  }

  show(): RequestHandler {
    return async (req: Request, res: Response) => {
      const { crn } = req.params

      const oasysSections: OASysSections = await this.personService.getOasysSections(req.user.token, crn)

      return res.render('assessments/pages/risk-information/oasys-information', {
        pageHeading: 'Risk of serious harm',
        oasysSections: {
          roshSummary: [oasysSections.roshSummary[0]],
        },
      })
    }
  }
}
