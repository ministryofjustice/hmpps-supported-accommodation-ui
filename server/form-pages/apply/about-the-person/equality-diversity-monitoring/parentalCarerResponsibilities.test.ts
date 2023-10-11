import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import ParentalCarerResponsibilities from './parentalCarerResponsibilities'
import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'

describe('CarerResponsibilities', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  describe('title', () => {
    it('personalises the page title', () => {
      const page = new ParentalCarerResponsibilities({}, application)

      expect(page.title).toEqual('Equality and diversity questions for Roger Smith')
    })
  })

  itShouldHaveNextValue(
    new ParentalCarerResponsibilities({ hasParentalOrCarerResponsibilities: 'yes' }, application),
    'marital-status',
  )
  itShouldHavePreviousValue(
    new ParentalCarerResponsibilities({ hasParentalOrCarerResponsibilities: 'yes' }, application),
    'care-leaver',
  )

  describe('response', () => {
    it('Adds selected option to page response in _translated_ form', () => {
      const page = new ParentalCarerResponsibilities(
        {
          hasParentalOrCarerResponsibilities: 'yes',
        },
        application,
      )

      expect(page.response()).toEqual({
        'Does Roger Smith have parental or carer responsibilities?': 'Yes',
      })
    })
  })

  describe('items', () => {
    it('returns the radio with the expected label text', () => {
      const page = new ParentalCarerResponsibilities(
        {
          hasParentalOrCarerResponsibilities: 'yes',
        },
        application,
      )

      expect(page.items()).toEqual([
        {
          value: 'yes',
          text: 'Yes',
          checked: true,
        },
        {
          value: 'no',
          text: 'No',
          checked: false,
        },
        {
          divider: 'or',
        },
        {
          value: 'dontKnow',
          text: `I don't know`,
          checked: false,
        },
      ])
    })
  })

  describe('errors', () => {
    it('does not return an error for valid answers', () => {
      const page = new ParentalCarerResponsibilities(
        {
          hasParentalOrCarerResponsibilities: 'no',
        },
        application,
      )

      expect(page.errors()).toEqual({})
    })

    it('should return errors when no answer given', () => {
      const page = new ParentalCarerResponsibilities({}, application)

      expect(page.errors()).toEqual({
        hasParentalOrCarerResponsibilities: `Choose either Yes, No or I don't know`,
      })
    })
  })
})
