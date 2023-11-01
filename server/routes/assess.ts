/* istanbul ignore file */

import type { Router } from 'express'

import type { Controllers } from '../controllers'
import paths from '../paths/assess'
import { Services } from '../services'
import { actions } from './utils'

export default function applyRoutes(controllers: Controllers, router: Router, services: Services): Router {
  const { get } = actions(router, services.auditService)

  const { submittedApplicationsController } = controllers

  get(paths.submittedApplications.show.pattern, submittedApplicationsController.show(), {
    auditEvent: 'VIEW_SUBMITTED_APPLICATION_SHOW',
  })

  return router
}
