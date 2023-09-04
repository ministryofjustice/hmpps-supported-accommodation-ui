import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import CommunicationAndLanguage from './communicationAndLanguage'

describe('CommunicationAndLanguage', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  describe('title', () => {
    it('personalises the page title', () => {
      const page = new CommunicationAndLanguage({}, application)

      expect(page.title).toEqual('Communication and language needs for Roger Smith')
    })
  })

  describe('questions', () => {
    const page = new CommunicationAndLanguage({}, application)

    describe('hasCommunicationNeeds', () => {
      it('has a question', () => {
        expect(page.questions.hasCommunicationNeeds.question).toBeDefined()
      })
      it('has a follow-up question', () => {
        expect(page.questions.hasCommunicationNeeds.communicationDetail.question).toBeDefined()
      })
    })

    describe('requiresInterpreter', () => {
      it('has a question', () => {
        expect(page.questions.requiresInterpreter.question).toBeDefined()
      })
      it('has a follow-up question', () => {
        expect(page.questions.requiresInterpreter.interpretationDetail.question).toBeDefined()
      })
    })

    describe('hasSupportNeeds', () => {
      it('has a question', () => {
        expect(page.questions.hasSupportNeeds.question).toBeDefined()
      })
      it('has a follow-up question', () => {
        expect(page.questions.hasSupportNeeds.supportDetail.question).toBeDefined()
      })
    })
  })

  itShouldHaveNextValue(new CommunicationAndLanguage({}, application), 'learning-difficulties')
  itShouldHavePreviousValue(new CommunicationAndLanguage({}, application), 'mental-health')

  describe('response', () => {
    it('returns the correct plain english responses for the questions', () => {
      const page = new CommunicationAndLanguage(
        {
          hasCommunicationNeeds: 'yes',
          communicationDetail: 'Is hard of hearing',
          requiresInterpreter: 'yes',
          interpretationDetail: 'Welsh',
          hasSupportNeeds: 'yes',
          supportDetail: 'Struggles with written comprehension',
        },
        application,
      )

      expect(page.response()).toEqual({
        'Do they have any additional communication needs?': 'Yes',
        'Please describe their communication needs.': 'Is hard of hearing',

        'Do they need an interpreter?': 'Yes',
        'What language do they need an interpreter for?': 'Welsh',

        'Do they need any support to see, hear, speak, or understand?': 'Yes',
        'Please describe their support needs.': 'Struggles with written comprehension',
      })
    })
  })

  describe('errors', () => {
    describe('when top-level questions are unanswered', () => {
      const page = new CommunicationAndLanguage({}, application)

      it('includes a validation error for _hasCommunicationNeeds_', () => {
        expect(page.errors()).toHaveProperty(
          'hasCommunicationNeeds',
          'Confirm whether they have additional communication needs',
        )
      })

      it('includes a validation error for _requiresInterpreter_', () => {
        expect(page.errors()).toHaveProperty('requiresInterpreter', 'Confirm whether they need an interpreter')
      })

      it('includes a validation error for _hasSupportNeeds_', () => {
        expect(page.errors()).toHaveProperty('hasSupportNeeds', 'Confirm they they need support')
      })
    })

    describe('when _hasCommunicationNeeds_ is YES', () => {
      const page = new CommunicationAndLanguage({ hasCommunicationNeeds: 'yes' }, application)

      describe('and _communicationDetail_ is UNANSWERED', () => {
        it('includes a validation error for _communicationDetail_', () => {
          expect(page.errors()).toHaveProperty('communicationDetail', 'Describe their communication needs')
        })
      })
    })

    describe('when _requiresInterpreter_ is YES', () => {
      const page = new CommunicationAndLanguage({ requiresInterpreter: 'yes' }, application)

      describe('and _interpretationDetail_ is UNANSWERED', () => {
        it('includes a validation error for _interpretationDetail_', () => {
          expect(page.errors()).toHaveProperty(
            'interpretationDetail',
            'Specify the language the interpreter is needed for',
          )
        })
      })
    })

    describe('when _hasSupportNeeds_ is YES', () => {
      const page = new CommunicationAndLanguage({ hasSupportNeeds: 'yes' }, application)

      describe('and _supportDetail_ is UNANSWERED', () => {
        it('includes a validation error for _supportDetail_', () => {
          expect(page.errors()).toHaveProperty(
            'supportDetail',
            'Describe the support needed to see, hear, speak or understand',
          )
        })
      })
    })
  })
})
