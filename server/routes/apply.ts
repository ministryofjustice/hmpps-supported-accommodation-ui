/* istanbul ignore file */

import type { Router } from 'express'
import Apply from '../form-pages/apply'

import type { Controllers } from '../controllers'
import paths from '../paths/apply'
import { Services } from '../services'
import { actions } from './utils'

export default function applyRoutes(controllers: Controllers, router: Router, services: Services): Router {
  const { pages } = Apply
  const { get, post, put } = actions(router, services.auditService)

  const { applicationsController, pagesController } = controllers

  get(
    paths.applications.beforeYouStart.pattern,
    (req, res, next) => {
      res.render('applications/before-you-start')
    },
    { auditEvent: 'VIEW_APPLICATION_BEFORE_YOU_START' },
  )
  get(paths.applications.new.pattern, applicationsController.new(), { auditEvent: 'VIEW_APPLICATION_NEW' })
  get(paths.applications.index.pattern, applicationsController.index(), { auditEvent: 'VIEW_APPLICATIONS_LIST' })
  get(paths.applications.prison.pattern, applicationsController.prisonDashboard(), {
    auditEvent: 'VIEW_PRISON_DASHBOARD',
  })
  get(paths.applications.show.pattern, applicationsController.show(), { auditEvent: 'VIEW_APPLICATION_START' })
  post(paths.applications.submission.pattern, applicationsController.submit(), { auditEvent: 'SUBMIT_APPLICATION' })
  post(paths.applications.create.pattern, applicationsController.create(), { auditEvent: 'CREATE_APPLICATION' })
  put(paths.applications.update.pattern, applicationsController.update(), { auditEvent: 'UPDATE_APPLICATION' })
  get(paths.applications.overview.pattern, applicationsController.overview(), {
    auditEvent: 'VIEW_SUBMITTED_APPLICATION_OVERVIEW_AS_REFERRER',
  })

  put(paths.applications.appendToList.pattern, applicationsController.appendToList(), {
    auditEvent: 'UPDATE_APPLICATION_LIST',
  })
  get(paths.applications.removeFromList.pattern, applicationsController.removeFromList(), {
    auditEvent: 'UPDATE_APPLICATION_LIST_REMOVE',
  })
  get(paths.applications.ineligible.pattern, applicationsController.ineligible(), {
    auditEvent: 'VIEW_APPLICATION_INELIGIBLE',
  })
  get(paths.applications.consentRefused.pattern, applicationsController.consentRefused(), {
    auditEvent: 'VIEW_APPLICATION_CONSENT_REFUSED',
  })

  Object.keys(pages).forEach((taskKey: string) => {
    Object.keys(pages[taskKey]).forEach((pageKey: string) => {
      const { pattern } = paths.applications.show.path(`tasks/${taskKey}/pages/${pageKey}`)

      get(pattern, pagesController.show(taskKey, pageKey), {
        auditEvent: 'VIEW_APPLICATION_PAGE',
        additionalMetadata: { task: taskKey, page: pageKey },
      })
      put(pattern, pagesController.update(taskKey, pageKey), {
        auditEvent: `UPDATE_APPLICATION_PAGE`,
        additionalMetadata: { task: taskKey, page: pageKey },
        redirectAuditEventSpecs: [
          {
            // If we redirect to the same page, the user has hit an error
            path: pattern,
            auditEvent: 'UPDATE_APPLICATION_PAGE_FAILURE',
          },
          {
            // If we redirect to the task list page, the application updated successfully
            path: paths.applications.show.pattern,
            auditEvent: 'UPDATE_APPLICATION_PAGE_SUCCESS',
          },
          {
            // If we redirect to another application page, the application updated successfully
            path: paths.applications.pages.show.pattern,
            auditEvent: 'UPDATE_APPLICATION_PAGE_SUCCESS',
          },
        ],
      })
    })
  })

  post(paths.applications.addNote.pattern, applicationsController.addNote(), {
    auditEvent: 'CREATE_APPLICATION_NOTE_AS_REFERRER',
  })

  return router
}
