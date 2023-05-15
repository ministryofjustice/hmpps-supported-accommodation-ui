import type { Express } from 'express'
import request from 'supertest'
import { services } from '../services'
import { controllers } from '../controllers'
import { appWithAllRoutes } from './testutils/appSetup'

let app: Express

beforeEach(() => {
  const servicesList = services()
  app = appWithAllRoutes({ controllers: controllers(servicesList) })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET /', () => {
  it('should render index page', () => {
    return request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Apply for a CAS-2 placement')
      })
  })
})
