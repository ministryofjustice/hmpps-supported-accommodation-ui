import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import HistoricalRisk from './historicalRisk'

describe('HistoricalRisk', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  describe('title', () => {
    it('personalises the page title', () => {
      const page = new HistoricalRisk({}, application)

      expect(page.title).toEqual(`Roger Smith's historical risks`)
    })
  })

  itShouldHaveNextValue(new HistoricalRisk({}, application), 'acct')
  itShouldHavePreviousValue(new HistoricalRisk({}, application), 'current-risk')

  describe('response', () => {
    it('not implemented', () => {
      const page = new HistoricalRisk({}, application)

      expect(page.response()).toEqual({})
    })
  })

  describe('errors', () => {
    it('not implemented', () => {
      const page = new HistoricalRisk({}, application)

      expect(page.errors()).toEqual({})
    })
  })
})
