import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import Acct from './acct'

describe('Acct', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  describe('title', () => {
    it('personalises the page title', () => {
      const page = new Acct({}, application)

      expect(page.title).toEqual('Assessment, Care in Custody and Teamwork (ACCT)')
    })
  })

  describe('acct data', () => {
    describe('when there is acct data on the application', () => {
      it('assigns them to the accts field on the page', () => {
        const applicationWithData = applicationFactory.build({
          person: personFactory.build({ name: 'Roger Smith' }),
          data: {
            'risk-to-self': {
              'acct-data': [
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
              ],
            },
          },
        })

        const page = new Acct({}, applicationWithData)

        expect(page.accts).toEqual([
          {
            referringInstitution: 'institution',
            createdDate: '01/02/2012',
            expiryDate: '10/10/2013',
            acctDetails: 'detail info',
          },
        ])
      })
    })
  })

  itShouldHaveNextValue(new Acct({}, application), 'additional-information')
  itShouldHavePreviousValue(new Acct({}, application), 'historical-risk')

  describe('response', () => {
    it('returns empty object', () => {
      const page = new Acct({}, application)

      expect(page.response()).toEqual({})
    })
  })

  describe('errors', () => {
    it('returns empty object', () => {
      const page = new Acct({}, application)
      expect(page.errors()).toEqual({})
    })
  })
})
