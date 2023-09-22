import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../shared-examples'

import { applicationFactory } from '../../../testutils/factories'
import Review from './review'

describe('Review', () => {
  const application = applicationFactory.build({})

  const body = {
    reviewed: '1',
  }

  describe('body', () => {
    it('should set the body', () => {
      const page = new Review(body, application)

      expect(page.body).toEqual(body)
    })
  })

  itShouldHaveNextValue(new Review(body, application), '')
  itShouldHavePreviousValue(new Review(body, application), 'dashboard')

  describe('errors', () => {
    it('should return an empty object', () => {
      const page = new Review({}, application)

      expect(page.errors()).toEqual({})
    })
  })

  describe('response', () => {
    it('should return an empty object', () => {
      const page = new Review({}, application)

      expect(page.response()).toEqual({})
    })
  })
})
