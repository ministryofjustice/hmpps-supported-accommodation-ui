import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import OtherHealth from './otherHealth'

describe('OtherHealth', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  describe('title', () => {
    it('personalises the page title', () => {
      const page = new OtherHealth({}, application)

      expect(page.title).toEqual('Other health needs for Roger Smith')
    })
  })

  describe('questions', () => {
    const page = new OtherHealth({}, application)

    describe('hasLongTermHealthCondition', () => {
      it('has a question, with a hint', () => {
        expect(page.questions.hasLongTermHealthCondition.question).toBeDefined()
        expect(page.questions.hasLongTermHealthCondition.hint).toBeDefined()
      })
      it('has 2 follow-up questions', () => {
        expect(page.questions.healthConditionDetail.question).toBeDefined()
        expect(page.questions.hasHadStroke.question).toBeDefined()
      })
    })

    describe('hasSeizures', () => {
      it('has a question', () => {
        expect(page.questions.hasSeizures.question).toBeDefined()
      })
      it('has a follow-up question', () => {
        expect(page.questions.seizuresDetail.question).toBeDefined()
      })
    })

    describe('beingTreatedForCancer', () => {
      it('has a question, with no follow-up', () => {
        expect(page.questions.beingTreatedForCancer.question).toBeDefined()
      })
    })
  })

  itShouldHaveNextValue(new OtherHealth({}, application), '')
  itShouldHavePreviousValue(new OtherHealth({}, application), 'brain-injury')

  describe('response', () => {
    it('returns the correct plain english responses for the questions', () => {
      const page = new OtherHealth(
        {
          hasLongTermHealthCondition: 'yes',
          healthConditionDetail: 'Chronic arthritis',
          hasHadStroke: 'no',
          hasSeizures: 'yes',
          seizuresDetail: 'Epilepsy. Controlled by anti-epilepsy meds',
          beingTreatedForCancer: 'no',
        },
        application,
      )

      expect(page.response()).toEqual({
        'Are they managing any long term health conditions?': 'Yes',
        'Please describe the long term health conditions.': 'Chronic arthritis',
        'Have they experienced a stroke?': 'No',
        'Do they experience seizures?': 'Yes',
        'Please describe the type and any treatment.': 'Epilepsy. Controlled by anti-epilepsy meds',
        'Are they currently receiving regular treatment for cancer?': 'No',
      })
    })
  })

  describe('errors', () => {
    describe('when top-level questions are unanswered', () => {
      const page = new OtherHealth({}, application)

      it('includes a validation error for _hasLongTermHealthCondition_', () => {
        expect(page.errors()).toHaveProperty(
          'hasLongTermHealthCondition',
          'Confirm whether they have a long term health condition',
        )
      })

      it('includes a validation error for _hasSeizures_', () => {
        expect(page.errors()).toHaveProperty('hasSeizures', 'Confirm whether they have seizures')
      })

      it('includes a validation error for _beingTreatedForCancer_', () => {
        expect(page.errors()).toHaveProperty(
          'beingTreatedForCancer',
          'Confirm whether they are receiving cancer treatment',
        )
      })
    })

    describe('when _hasLongTermHealthCondition_ is YES', () => {
      const page = new OtherHealth({ hasLongTermHealthCondition: 'yes' }, application)

      describe('and _healthConditionDetail_ is UNANSWERED', () => {
        it('includes a validation error for _healthConditionDetail_', () => {
          expect(page.errors()).toHaveProperty('healthConditionDetail', 'Provide details of their health conditions')
        })
      })

      describe('and _hasHadStroke_ is UNANSWERED', () => {
        it('includes a validation error for _hasHadStroke_', () => {
          expect(page.errors()).toHaveProperty('hasHadStroke', 'Confirm whether they have had a stroke')
        })
      })
    })

    describe('when _hasSeizures_ is YES', () => {
      const page = new OtherHealth({ hasSeizures: 'yes' }, application)

      describe('and _seizuresDetail_ is UNANSWERED', () => {
        it('includes a validation error for _seizuresDetail_', () => {
          expect(page.errors()).toHaveProperty('seizuresDetail', 'Provide details of the seizure type and treatment')
        })
      })
    })
  })
})
