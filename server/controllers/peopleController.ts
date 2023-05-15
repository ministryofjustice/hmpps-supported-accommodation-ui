import type { Request, RequestHandler, Response } from 'express'
import paths from '../paths/apply'

export default class PeopleController {
  find(): RequestHandler {
    return async (req: Request, res: Response) => {
      const { crn } = req.body

      if (crn) {
        // TODO: error handling if invalid/not found CRN
        res.redirect(paths.applications.show({ crn }))
      } else {
        res.redirect(req.headers.referer || '')
      }
    }
  }
}
