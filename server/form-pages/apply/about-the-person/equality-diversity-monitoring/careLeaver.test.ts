import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import CareLeaver from './careLeaver'
import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'

describe('CareLeaver', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  describe('title', () => {
    it('personalises the page title', () => {
      const page = new CareLeaver({}, application)

      expect(page.title).toEqual('Equality and diversity questions for Roger Smith')
    })
  })

  itShouldHaveNextValue(new CareLeaver({ isCareLeaver: 'yes' }, application), 'parental-carer-responsibilities')
  itShouldHavePreviousValue(new CareLeaver({ isCareLeaver: 'yes' }, application), 'military-veteran')

  describe('response', () => {
    it('Adds selected option to page response in _translated_ form', () => {
      const page = new CareLeaver(
        {
          isCareLeaver: 'yes',
        },
        application,
      )

      expect(page.response()).toEqual({
        'Is Roger Smith a care leaver?': 'Yes',
      })
    })
  })

  describe('items', () => {
    it('returns the radio with the expected label text', () => {
      const page = new CareLeaver(
        {
          isCareLeaver: 'yes',
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
      const page = new CareLeaver(
        {
          isCareLeaver: 'no',
        },
        application,
      )

      expect(page.errors()).toEqual({})
    })

    it('should return errors when no answer given', () => {
      const page = new CareLeaver({}, application)

      expect(page.errors()).toEqual({
        isCareLeaver: `Choose either Yes, No or I don't know`,
      })
    })
  })
})
