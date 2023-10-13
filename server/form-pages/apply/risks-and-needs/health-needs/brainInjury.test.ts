import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import BrainInjury from './brainInjury'

describe('BrainInjury', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  describe('title', () => {
    it('personalises the page title', () => {
      const page = new BrainInjury({}, application)

      expect(page.title).toEqual('Brain injury needs for Roger Smith')
    })
  })

  describe('questions', () => {
    const page = new BrainInjury({}, application)

    describe('hasBrainInjury', () => {
      it('has a question', () => {
        expect(page.questions.hasBrainInjury.question).toBeDefined()
      })
      it('has one follow-up question', () => {
        expect(page.questions.injuryDetail.question).toBeDefined()
      })
    })

    describe('isVulnerable', () => {
      it('has a question', () => {
        expect(page.questions.isVulnerable.question).toBeDefined()
      })
      it('has one follow-up question', () => {
        expect(page.questions.vulnerabilityDetail.question).toBeDefined()
      })
    })

    describe('hasDifficultyInteracting', () => {
      it('has a question', () => {
        expect(page.questions.hasDifficultyInteracting.question).toBeDefined()
      })
      it('has one follow-up question', () => {
        expect(page.questions.interactionDetail.question).toBeDefined()
      })
    })

    describe('requiresAdditionalSupport', () => {
      it('has a question', () => {
        expect(page.questions.requiresAdditionalSupport.question).toBeDefined()
      })
      it('has one follow-up question', () => {
        expect(page.questions.addSupportDetail.question).toBeDefined()
      })
    })
  })

  itShouldHaveNextValue(new BrainInjury({}, application), 'other-health')
  itShouldHavePreviousValue(new BrainInjury({}, application), 'learning-difficulties')

  describe('response', () => {
    it('returns the correct plain english responses for the questions', () => {
      const page = new BrainInjury(
        {
          hasBrainInjury: 'yes',
          injuryDetail: 'Has frontal lobe damage',
          isVulnerable: 'yes',
          vulnerabilityDetail: 'Moderate: can put themselves in danger',
          hasDifficultyInteracting: 'yes',
          interactionDetail: 'Can misunderstand situations',
          requiresAdditionalSupport: 'yes',
          addSupportDetail: 'Regular support is needed',
        },
        application,
      )

      expect(page.response()).toEqual({
        'Do they have a brain injury?': 'Yes',
        'Please describe their brain injury and needs.': 'Has frontal lobe damage',
        'Are they vulnerable as a result of this injury?': 'Yes',
        'Please describe their level of vulnerability.': 'Moderate: can put themselves in danger',
        'Do they have difficulties interacting with other people as a result of this injury?': 'Yes',
        'Please describe these difficulties.': 'Can misunderstand situations',
        'Is additional support required?': 'Yes',
        'Please describe the type of support.': 'Regular support is needed',
      })
    })
  })

  describe('errors', () => {
    describe('when top-level questions are unanswered', () => {
      const page = new BrainInjury({}, application)

      it('includes a validation error for _hasBrainInjury_', () => {
        expect(page.errors()).toHaveProperty('hasBrainInjury', 'Confirm whether they have a brain injury')
      })

      it('includes a validation error for _isVulnerable_', () => {
        expect(page.errors()).toHaveProperty('isVulnerable', 'Confirm whether they are vulnerable')
      })

      it('includes a validation error for _hasDifficultyInteracting_', () => {
        expect(page.errors()).toHaveProperty(
          'hasDifficultyInteracting',
          'Confirm whether they have difficulties interacting',
        )
      })

      it('includes a validation error for _requiresAdditionalSupport_', () => {
        expect(page.errors()).toHaveProperty(
          'requiresAdditionalSupport',
          'Confirm whether additional support is required',
        )
      })
    })

    describe('when _hasBrainInjury_ is YES', () => {
      const page = new BrainInjury({ hasBrainInjury: 'yes' }, application)

      describe('and _injuryDetail_ is UNANSWERED', () => {
        it('includes a validation error for _injuryDetail_', () => {
          expect(page.errors()).toHaveProperty('injuryDetail', 'Describe their brain injury and needs')
        })
      })
    })

    describe('when _isVulnerable_ is YES', () => {
      const page = new BrainInjury({ isVulnerable: 'yes' }, application)

      describe('and _vulnerabilityDetail_ is UNANSWERED', () => {
        it('includes a validation error for _vulnerabilityDetail_', () => {
          expect(page.errors()).toHaveProperty('vulnerabilityDetail', 'Describe their level of vulnerability')
        })
      })
    })

    describe('when _hasDifficultyInteracting_ is YES', () => {
      const page = new BrainInjury({ hasDifficultyInteracting: 'yes' }, application)

      describe('and _interactionDetail_ is UNANSWERED', () => {
        it('includes a validation error for _interactionDetail_', () => {
          expect(page.errors()).toHaveProperty(
            'interactionDetail',
            'Describe their difficulties interacting with other people',
          )
        })
      })
    })

    describe('when _requiresAdditionalSupport_ is YES', () => {
      const page = new BrainInjury({ requiresAdditionalSupport: 'yes' }, application)

      describe('and _addSupportDetail_ is UNANSWERED', () => {
        it('includes a validation error for _addSupportDetail_', () => {
          expect(page.errors()).toHaveProperty('addSupportDetail', 'Describe the additional support required')
        })
      })
    })
  })
})
