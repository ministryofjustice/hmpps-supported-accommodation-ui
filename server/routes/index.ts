/* istanbul ignore file */

import { Router } from 'express'
import { Controllers } from '../controllers'
import { Services } from '../services'
import { actions } from './utils'
import paths from '../paths/apply'
import applyRoutes from './apply'
import assessRoutes from './assess'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function routes(controllers: Controllers, services: Services): Router {
  const router = Router()
  const { get, post } = actions(router, services.auditService)

  get(
    '/',
    (req, res, next) => {
      res.render('pages/index')
    },
    { auditEvent: 'VIEW_LANDING' },
  )

  const { peopleController } = controllers

  post(paths.applications.people.find.pattern, peopleController.find(), {
    auditEvent: 'FIND_APPLICATION_PERSON',
    auditBodyParams: ['crn'],
  })

  applyRoutes(controllers, router, services)
  assessRoutes(controllers, router, services)

  return router
}
