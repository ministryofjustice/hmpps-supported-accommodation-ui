import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import MaritalStatus from './maritalStatus'

describe('Marital status', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  describe('title', () => {
    it('personalises the page title', () => {
      const page = new MaritalStatus({}, application)

      expect(page.title).toEqual('Equality and diversity questions for Roger Smith')
    })
  })

  itShouldHaveNextValue(new MaritalStatus({}, application), '')
  itShouldHavePreviousValue(new MaritalStatus({}, application), 'parental-carer-responsibilities')

  describe('response', () => {
    it('Adds selected option to page response in _translated_ form', () => {
      const page = new MaritalStatus({ maritalStatus: 'divorced' }, application)

      expect(page.response()).toEqual({
        "What is Roger Smith's legal marital or registered civil partnership status?": 'Divorced',
      })
    })
  })

  describe('items', () => {
    it('returns the radio with the expected label text', () => {
      const page = new MaritalStatus({ maritalStatus: 'survivingPartnerFromCivilPartnership' }, application)
      expect(page.items()).toEqual([
        {
          checked: false,
          text: 'Never married and never registered in a civil partnership',
          value: 'neverMarried',
        },
        {
          checked: false,
          text: 'Married',
          value: 'married',
        },
        {
          checked: false,
          text: 'In a registered civil partnership',
          value: 'inCivilPartnership',
        },
        {
          checked: false,
          text: 'Separated, but still legally married',
          value: 'marriedButSeparated',
        },
        {
          checked: false,
          text: 'Separated, but still legally in a civil partnership',
          value: 'inCivilPartnershipButSeparated',
        },
        {
          checked: false,
          text: 'Divorced',
          value: 'divorced',
        },
        {
          checked: false,
          text: 'Formerly in a civil partnership which is now legally dissolved',
          value: 'formerlyInCivilPartnershipNowDissolved',
        },
        {
          checked: false,
          text: 'Widowed',
          value: 'widowed',
        },
        {
          checked: true,
          text: 'Surviving partner from a registered civil partnership',
          value: 'survivingPartnerFromCivilPartnership',
        },
        { divider: 'or' },
        {
          value: 'preferNotToSay',
          text: 'Prefer not to say',
          checked: false,
        },
      ])
    })
  })

  describe('errors', () => {
    it('should return errors when the questions are blank', () => {
      const page = new MaritalStatus({}, application)

      expect(page.errors()).toEqual({
        maritalStatus: "Select a marital status or 'Prefer not to say'",
      })
    })
  })
})
