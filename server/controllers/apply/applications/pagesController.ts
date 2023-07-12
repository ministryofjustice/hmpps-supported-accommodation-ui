import type { NextFunction, Request, RequestHandler, Response } from 'express'
import createError from 'http-errors'

import type { DataServices } from '@approved-premises/ui'
import { ApplicationService } from '../../../services'

import { catchAPIErrorOrPropogate, fetchErrorsAndUserInput } from '../../../utils/validation'
import { UnknownPageError } from '../../../utils/errors'
import { viewPath } from '../../../form-pages/utils'
import { getPage } from '../../../utils/applications/getPage'

export default class PagesController {
  constructor(private readonly applicationService: ApplicationService, private readonly dataServices: DataServices) {}

  show(taskName: string, pageName: string): RequestHandler {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const Page = getPage(taskName, pageName, 'applications')
        const { errors, errorSummary, userInput } = fetchErrorsAndUserInput(req)
        const page = await this.applicationService.initializePage(Page, req, this.dataServices, userInput)

        res.render(viewPath(page, 'applications'), {
          applicationId: req.params.id,
          errors,
          errorSummary,
          task: taskName,
          page,
          ...page.body,
        })
      } catch (e) {
        if (e instanceof UnknownPageError) {
          next(createError(404, 'Not found'))
        } else {
          catchAPIErrorOrPropogate(req, res, e)
        }
      }
    }
  }
}
