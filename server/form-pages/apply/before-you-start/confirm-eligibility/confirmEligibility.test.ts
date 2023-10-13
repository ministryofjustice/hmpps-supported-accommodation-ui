import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import ConfirmEligibility from './confirmEligibility'
import { applicationFactory, personFactory } from '../../../../testutils/factories/index'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { getQuestions } from '../../../../form-pages/utils/questions'

describe('ConfirmEligibility', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  const questions = getQuestions('Roger Smith')

  describe('question', () => {
    it('personalises the question', () => {
      const page = new ConfirmEligibility({ isEligible: 'yes' }, application)

      expect(page.questions).toEqual({
        isEligible: questions['confirm-eligibility']['confirm-eligibility'].isEligible.question,
      })
    })
  })

  describe('title', () => {
    it('personalises the page title', () => {
      const page = new ConfirmEligibility({ isEligible: 'yes' }, application)

      expect(page.title).toEqual('Check Roger Smith is eligible for Short-Term Accommodation (CAS-2)')
    })
  })

  itShouldHaveNextValue(new ConfirmEligibility({ isEligible: 'yes' }, application), '')
  itShouldHavePreviousValue(new ConfirmEligibility({ isEligible: 'yes' }, application), 'taskList')

  describe('response', () => {
    it('Adds selected option to page response in _translated_ form', () => {
      const page = new ConfirmEligibility({ isEligible: 'yes' }, application)

      expect(page.response()).toEqual({
        'Is Roger Smith eligible for Short-Term Accommodation (CAS-2)?': 'Yes, I confirm Roger Smith is eligible',
      })
    })

    it('Deletes fields where there is not an answer', () => {
      const page = new ConfirmEligibility({ isEligible: undefined }, application)

      expect(page.response()).toEqual({})
    })
  })

  describe('items', () => {
    it('returns the radio with the expected label text', () => {
      const page = new ConfirmEligibility({ isEligible: 'yes' }, application)

      expect(page.items()).toEqual([
        {
          value: 'yes',
          text: questions['confirm-eligibility']['confirm-eligibility'].isEligible.answers.yes,
          checked: true,
        },
        {
          value: 'no',
          text: questions['confirm-eligibility']['confirm-eligibility'].isEligible.answers.no,
          checked: false,
        },
      ])
    })
  })

  describe('errors', () => {
    it('should return errors when yes/no questions are blank', () => {
      const page = new ConfirmEligibility({}, application)

      expect(page.errors()).toEqual({
        isEligible: 'Confirm whether the applicant is eligible or not eligible',
      })
    })
  })
})
