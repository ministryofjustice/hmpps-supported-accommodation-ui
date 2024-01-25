/* eslint-disable no-param-reassign */
/* istanbul ignore file */

import express from 'express'
import nunjucks from 'nunjucks'
import * as pathModule from 'path'

import { ErrorMessages, PersonStatus } from '@approved-premises/ui'
import config from '../config'
import applicationPaths from '../paths/apply'
import assessPaths from '../paths/assess'
import reportPaths from '../paths/report'
import staticPaths from '../paths/static'
import {
  documentSummaryListRows,
  inProgressApplicationTableRows,
  submittedApplicationTableRows,
} from './applicationUtils'
import {
  getApplicationTimelineEvents,
  getSideNavLinksForApplication,
  getSideNavLinksForDocument,
  stringToKebabCase,
} from './applications/utils'
import { applicationStatusRadios } from './assessUtils'
import { checkYourAnswersSections, getApplicantDetails } from './checkYourAnswersUtils'
import { DateFormats } from './dateUtils'
import { dateFieldValues } from './formUtils'
import * as OasysImportUtils from './oasysImportUtils'
import { statusTag } from './personUtils'
import * as TaskListUtils from './taskListUtils'
import { initialiseName, removeBlankSummaryListItems } from './utils'

const production = process.env.NODE_ENV === 'production'

export default function nunjucksSetup(app: express.Express, path: pathModule.PlatformPath): void {
  app.set('view engine', 'njk')

  app.locals.asset_path = '/assets/'
  app.locals.applicationName = 'Short-Term Accommodation (CAS-2)'

  // Cachebusting version string
  if (production) {
    // Version only changes on reboot
    app.locals.version = Date.now().toString()
  } else {
    // Version changes every request
    app.use((req, res, next) => {
      res.locals.version = Date.now().toString()
      return next()
    })
  }

  const njkEnv = nunjucks.configure(
    [
      path.join(__dirname, '../../server/views'),
      'node_modules/govuk-frontend/',
      'node_modules/govuk-frontend/components/',
      'node_modules/@ministryofjustice/frontend/',
      'node_modules/@ministryofjustice/frontend/moj/components/',
    ],
    {
      autoescape: true,
      express: app,
      dev: true, // This is set to true to allow us to see the full stacktrace from errors in global functions, otherwise it gets swallowed and tricky to see in logs
    },
  )

  njkEnv.addFilter('initialiseName', initialiseName)

  njkEnv.addGlobal('fetchContext', function fetchContext() {
    return this.ctx
  })

  njkEnv.addGlobal('mergeObjects', (obj1: Record<string, unknown>, obj2: Record<string, unknown>) => {
    return { ...obj1, ...obj2 }
  })

  njkEnv.addGlobal('OasysImportUtils', OasysImportUtils)

  njkEnv.addGlobal('paths', { ...applicationPaths, ...assessPaths, ...reportPaths, ...staticPaths })
  njkEnv.addGlobal('TaskListUtils', TaskListUtils)

  njkEnv.addGlobal('inProgressApplicationTableRows', inProgressApplicationTableRows)
  njkEnv.addGlobal('submittedApplicationTableRows', submittedApplicationTableRows)
  njkEnv.addGlobal('documentSummaryListRows', documentSummaryListRows)

  const {
    analytics: { tagManagerId },
  } = config
  if (tagManagerId) {
    njkEnv.addGlobal('tagManagerId', tagManagerId.trim())
    njkEnv.addGlobal('tagManagerUrl', `https://www.googletagmanager.com/ns.html?id=${tagManagerId.trim()}`)
  }

  njkEnv.addGlobal('dateFieldValues', function sendContextToDateFieldValues(fieldName: string, errors: ErrorMessages) {
    return dateFieldValues(fieldName, this.ctx, errors)
  })
  njkEnv.addGlobal('formatDate', DateFormats.isoDateToUIDate)

  njkEnv.addGlobal('checkYourAnswersSections', checkYourAnswersSections)
  njkEnv.addGlobal('getApplicantDetails', getApplicantDetails)

  njkEnv.addGlobal('getApplicationTimelineEvents', getApplicationTimelineEvents)
  njkEnv.addGlobal('applicationStatusRadios', applicationStatusRadios)

  njkEnv.addFilter('removeBlankSummaryListItems', removeBlankSummaryListItems)

  const markAsSafe = (html: string): string => {
    const safeFilter = njkEnv.getFilter('safe')
    return safeFilter(html)
  }

  njkEnv.addGlobal('statusTag', (status: PersonStatus) => markAsSafe(statusTag(status)))
  njkEnv.addGlobal('getSideNavLinksForDocument', getSideNavLinksForDocument)
  njkEnv.addGlobal('getSideNavLinksForApplication', getSideNavLinksForApplication)
  njkEnv.addGlobal('stringToKebabCase', stringToKebabCase)
}
