import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../shared-examples'
import FundingInformation from './fundingInformation'

describe('FundingInformation', () => {
  describe('title', () => {
    it('sets the question title as the page title', () => {
      const page = new FundingInformation({ fundingSource: 'personalSavings' })

      expect(page.questions).toEqual({
        fundingSource: 'How will you pay for CAS-2 accommodation and the service charge?',
      })
    })
  })

  it('should set the body', () => {
    const page = new FundingInformation({
      fundingSource: 'personalSavings',
    })

    expect(page.body).toEqual({
      fundingSource: 'personalSavings',
    })
  })

  describe('response', () => {
    it('Adds selected option to page response in _translated_ form', () => {
      const page = new FundingInformation({ fundingSource: 'personalSavings' })

      expect(page.response()).toEqual({
        'How will you pay for CAS-2 accommodation and the service charge?': 'Personal money / savings',
      })
    })
  })

  itShouldHaveNextValue(new FundingInformation({ fundingSource: 'personalSavings' }), '')
  itShouldHavePreviousValue(new FundingInformation({ fundingSource: 'personalSavings' }), 'dashboard')

  describe('errors', () => {
    it('should return errors when yes/no questions are blank', () => {
      const page = new FundingInformation({})

      expect(page.errors()).toEqual({
        fundingSource: 'You must specify a funding source',
      })
    })
  })
})
