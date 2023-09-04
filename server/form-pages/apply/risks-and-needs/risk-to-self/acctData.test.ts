import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import AcctData from './acctData'

describe('AcctData', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  const acctData = [
    {
      referringInstitution: 'institution',
      'createdDate-day': '1',
      'createdDate-month': '2',
      'createdDate-year': '2012',
      'expiryDate-day': '10',
      'expiryDate-month': '10',
      'expiryDate-year': '2013',
      acctDetails: 'detail info',
    },
  ]

  describe('title', () => {
    it('has a page title', () => {
      const page = new AcctData({}, application)

      expect(page.title).toEqual('Add an ACCT entry')
    })
  })

  itShouldHaveNextValue(new AcctData({}, application), 'acct')
  itShouldHavePreviousValue(new AcctData({}, application), 'acct')

  describe('response', () => {
    describe('when there are accts on an application', () => {
      it('returns the accts', () => {
        const applicationWithAcctData = applicationFactory.build({
          person: personFactory.build({ name: 'Roger Smith' }),
          data: { 'risk-to-self': { 'acct-data': acctData } },
        })
        const page = new AcctData({}, applicationWithAcctData)

        expect(page.response()).toEqual(acctData)
      })
    })

    describe('when there are no accts on an application', () => {
      it('returns empty array', () => {
        const page = new AcctData({}, application)

        expect(page.response()).toEqual([])
      })
    })
  })

  describe('errors', () => {
    describe('when there are no errors', () => {
      it('returns empty object', () => {
        const page = new AcctData(acctData[0], application)
        expect(page.errors()).toEqual({})
      })
    })

    const requiredFields = [
      ['createdDate', 'Add a valid created date, for example 2 3 2013'],
      ['expiryDate', 'Add a valid expiry date, for example 2 3 2013'],
      ['referringInstitution', 'Add a referring institution'],
      ['acctDetails', 'Enter the details of the ACCT'],
    ]

    it.each(requiredFields)('it includes a validation error for %s', (field, message) => {
      const page = new AcctData(
        {
          'createdDate-day': '',
          'createdDate-month': '',
          'createdDate-year': '',
          'expiryDate-day': '',
          'expiryDate-month': '',
          'expiryDate-year': '',
          referringInstitution: '',
          acctDetails: '',
        },
        application,
      )
      const errors = page.errors()

      expect(errors[field]).toEqual(message)
    })
  })
})
