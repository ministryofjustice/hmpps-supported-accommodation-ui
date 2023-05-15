import type { NextFunction, Request, Response } from 'express'
import { DeepMocked, createMock } from '@golevelup/ts-jest'

import paths from '../paths/apply'
import PeopleController from './peopleController'

describe('applicationsController', () => {
  const token = 'SOME_TOKEN'
  const crn = '1234'

  let request: DeepMocked<Request> = createMock<Request>({ user: { token } })
  let response: DeepMocked<Response> = createMock<Response>({})
  const next: DeepMocked<NextFunction> = jest.fn()

  let peopleController: PeopleController

  beforeEach(() => {
    peopleController = new PeopleController()
    request = createMock<Request>({ user: { token }, body: { crn } })
    response = createMock<Response>({})
    jest.clearAllMocks()
  })

  describe('find', () => {
    describe('when there is a crn', () => {
      it('redirects to the show applications path', () => {
        const requestHandler = peopleController.find()
        requestHandler(request, response, next)
        expect(response.redirect).toHaveBeenCalledWith(paths.applications.show({ crn }))
      })
    })

    describe('when there is not a crn', () => {
      it('redirects back to referrer url', () => {
        const requestHandler = peopleController.find()
        request = createMock<Request>({ user: { token }, headers: { referer: 'example.com' } })
        requestHandler(request, response, next)
        expect(response.redirect).toHaveBeenCalledWith(request.headers.referer)
      })
    })
  })
})
