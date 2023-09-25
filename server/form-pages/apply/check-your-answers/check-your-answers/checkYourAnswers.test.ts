import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'

import { applicationFactory } from '../../../../testutils/factories'
import CheckYourAnswers from './checkYourAnswers'

describe('CheckYourAnswers', () => {
  const application = applicationFactory.build({})

  const body = {
    reviewed: '1',
  }

  describe('body', () => {
    it('should set the body', () => {
      const page = new CheckYourAnswers(body, application)

      expect(page.body).toEqual(body)
    })
  })

  itShouldHaveNextValue(new CheckYourAnswers(body, application), '')
  itShouldHavePreviousValue(new CheckYourAnswers(body, application), 'dashboard')

  describe('errors', () => {
    it('should return an empty object', () => {
      const page = new CheckYourAnswers({}, application)

      expect(page.errors()).toEqual({})
    })
  })

  describe('response', () => {
    it('should return an empty object', () => {
      const page = new CheckYourAnswers({}, application)

      expect(page.response()).toEqual({})
    })
  })
})
