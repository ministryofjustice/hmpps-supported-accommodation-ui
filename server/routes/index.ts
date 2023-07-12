import { type RequestHandler, Router } from 'express'

import { Controllers } from 'server/controllers'
import asyncMiddleware from '../middleware/asyncMiddleware'
import paths from '../paths/apply'
import applyRoutes from './apply'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function routes(controllers: Controllers): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string | string[], handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  get('/', (req, res, next) => {
    res.render('pages/index')
  })

  const { applicationsController, peopleController } = controllers

  get(paths.applications.new.pattern, applicationsController.new())
  get(paths.applications.show.pattern, applicationsController.show())

  post(paths.applications.create.pattern, applicationsController.create())
  post(paths.applications.people.find.pattern, peopleController.find())

  applyRoutes(controllers, router)

  return router
}
