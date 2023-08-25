import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import CurrentRisk from './currentRisk'

describe('CurrentRisk', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  describe('title', () => {
    it('personalises the page title', () => {
      const page = new CurrentRisk({}, application)

      expect(page.title).toEqual(`Roger Smith's current risks`)
    })
  })

  itShouldHaveNextValue(new CurrentRisk({}, application), 'current-risk')
  itShouldHavePreviousValue(new CurrentRisk({}, application), 'guidance')

  describe('response', () => {
    it('not implemented', () => {
      const page = new CurrentRisk({}, application)

      expect(page.response()).toEqual({})
    })
  })

  describe('errors', () => {
    it('not implemented', () => {
      const page = new CurrentRisk({}, application)

      expect(page.errors()).toEqual({})
    })
  })
})
