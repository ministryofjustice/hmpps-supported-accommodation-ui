/* istanbul ignore file */

import type { Router, RequestHandler } from 'express'
import Apply from '../form-pages/apply'

import type { Controllers } from '../controllers'
import paths from '../paths/apply'
import asyncMiddleware from '../middleware/asyncMiddleware'

export default function applyRoutes(controllers: Controllers, router: Router): Router {
  const { pages } = Apply
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  const { pagesController } = controllers

  Object.keys(pages).forEach((taskKey: string) => {
    Object.keys(pages[taskKey]).forEach((pageKey: string) => {
      const { pattern } = paths.applications.show.path(`tasks/${taskKey}/pages/${pageKey}`)

      get(pattern, pagesController.show(taskKey, pageKey))
    })
  })

  return router
}
