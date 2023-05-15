import type { NextFunction, Request, Response } from 'express'
import { DeepMocked, createMock } from '@golevelup/ts-jest'
import { OASysSections } from '@approved-premises/api'

import ApplicationsController from './applicationsController'
import { PersonService } from '../../services'

describe('applicationsController', () => {
  const token = 'SOME_TOKEN'

  let request: DeepMocked<Request> = createMock<Request>({ user: { token } })
  let response: DeepMocked<Response> = createMock<Response>({})
  const next: DeepMocked<NextFunction> = jest.fn()

  const personService = createMock<PersonService>({})

  let applicationsController: ApplicationsController

  beforeEach(() => {
    applicationsController = new ApplicationsController(personService)
    request = createMock<Request>({ user: { token } })
    response = createMock<Response>({})
    jest.clearAllMocks()
  })

  describe('new', () => {
    it('renders the crn form', () => {
      const requestHandler = applicationsController.new()
      requestHandler(request, response, next)
      expect(response.render).toHaveBeenCalledWith('applications/new', {
        pageHeading: "Enter the person's CRN",
      })
    })
  })

  describe('show', () => {
    it('renders oasys information view', async () => {
      const oasysSections = {
        roshSummary: [{}],
      }
      personService.getOasysSections.mockResolvedValue(oasysSections as OASysSections)

      const requestHandler = applicationsController.show()
      await requestHandler(request, response, next)

      expect(response.render).toHaveBeenCalledWith('assessments/pages/risk-information/oasys-information', {
        pageHeading: 'Risk of serious harm',
        oasysSections,
      })
    })
  })
})
