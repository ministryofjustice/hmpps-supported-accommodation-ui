import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../shared-examples'
import FundingInformation from './fundingInformation'
import { personFactory, applicationFactory } from '../../../testutils/factories/index'

describe('FundingInformation', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  describe('title', () => {
    it('sets the question title as the page title', () => {
      const page = new FundingInformation({ fundingSource: 'personalSavings' }, application)

      expect(page.questions).toEqual({
        fundingSource: 'How will Roger Smith pay for their accommodation and service charge?',
      })
    })
  })

  it('should set the body', () => {
    const page = new FundingInformation(
      {
        fundingSource: 'personalSavings',
      },
      application,
    )

    expect(page.body).toEqual({
      fundingSource: 'personalSavings',
    })
  })

  describe('response', () => {
    it('Adds selected option to page response in _translated_ form', () => {
      const page = new FundingInformation({ fundingSource: 'personalSavings' }, application)

      expect(page.response()).toEqual({
        'How will Roger Smith pay for their accommodation and service charge?': 'Personal money or savings',
      })
    })
  })

  itShouldHaveNextValue(new FundingInformation({ fundingSource: 'personalSavings' }, application), '')
  itShouldHavePreviousValue(new FundingInformation({ fundingSource: 'personalSavings' }, application), 'dashboard')

  describe('errors', () => {
    it('should return errors when yes/no questions are blank', () => {
      const page = new FundingInformation({}, application)

      expect(page.errors()).toEqual({
        fundingSource: 'You must specify a funding source',
      })
    })
  })
})
