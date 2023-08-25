import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import CurrentRisks from './currentRisks'

describe('CurrentRisks', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  describe('title', () => {
    it('personalises the page title', () => {
      const page = new CurrentRisks({}, application)

      expect(page.title).toEqual(`Roger Smith's current risks`)
    })
  })

  itShouldHaveNextValue(new CurrentRisks({}, application), 'current-risks')
  itShouldHavePreviousValue(new CurrentRisks({}, application), 'guidance')

  describe('response', () => {
    it('not implemented', () => {
      const page = new CurrentRisks({}, application)

      expect(page.response()).toEqual({})
    })
  })

  describe('errors', () => {
    it('not implemented', () => {
      const page = new CurrentRisks({}, application)

      expect(page.errors()).toEqual({})
    })
  })
})
