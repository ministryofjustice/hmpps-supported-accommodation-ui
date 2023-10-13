import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import SubstanceMisuse from './substanceMisuse'

describe('SubstanceMisuse', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  describe('title', () => {
    it('personalises the page title', () => {
      const page = new SubstanceMisuse({}, application)

      expect(page.title).toEqual('Health needs for Roger Smith')
    })
  })

  describe('Questions', () => {
    const page = new SubstanceMisuse({}, application)

    describe('usesIllegalSubstances', () => {
      it('has a question', () => {
        expect(page.questions.usesIllegalSubstances.question).toBeDefined()
      })
      it('has two follow-up questions', () => {
        expect(page.questions.substanceMisuseHistory.question).toBeDefined()
        expect(page.questions.substanceMisuseDetail.question).toBeDefined()
      })
    })

    describe('engagedWithDrugAndAlcoholService', () => {
      it('has a question', () => {
        expect(page.questions.engagedWithDrugAndAlcoholService.question).toBeDefined()
      })
      it('has a follow-up question', () => {
        expect(page.questions.drugAndAlcoholServiceDetail.question).toBeDefined()
      })
    })

    describe('substituteMedication', () => {
      it('has a question', () => {
        expect(page.questions.requiresSubstituteMedication.question).toBeDefined()
      })
      it('has a follow-up question', () => {
        expect(page.questions.substituteMedicationDetail.question).toBeDefined()
      })
    })
  })

  itShouldHaveNextValue(new SubstanceMisuse({}, application), 'physical-health')
  itShouldHavePreviousValue(new SubstanceMisuse({}, application), 'taskList')

  describe('response', () => {
    it('returns the correct plain english responses for the questions', () => {
      const page = new SubstanceMisuse(
        {
          usesIllegalSubstances: 'yes',
          substanceMisuseHistory: 'Heroin',
          substanceMisuseDetail: 'Injects daily',
          engagedWithDrugAndAlcoholService: 'yes',
          drugAndAlcoholServiceDetail: 'The Drugs Project',
          requiresSubstituteMedication: 'yes',
          substituteMedicationDetail: 'Methadone',
        },
        application,
      )

      expect(page.response()).toEqual({
        'Do they take any illegal substances?': 'Yes',
        'What substances do they take?': 'Heroin',
        'How often do they take these substances, by what method, and how much?': 'Injects daily',
        'Are they engaged with a drug and alcohol service?': 'Yes',
        'Name the drug and alcohol service': 'The Drugs Project',
        'Do they require any substitute medication for misused substances?': 'Yes',
        'What substitute medication do they take?': 'Methadone',
      })
    })
  })

  describe('errors', () => {
    describe('when top-level questions are unanswered', () => {
      const page = new SubstanceMisuse({}, application)

      it('includes a validation error for _usesIllegalSubstances_', () => {
        expect(page.errors()).toHaveProperty(
          'usesIllegalSubstances',
          'Confirm whether they take any illegal substances',
        )
      })

      it('includes a validation error for _engagedWithDrugAndAlcoholService_', () => {
        expect(page.errors()).toHaveProperty(
          'engagedWithDrugAndAlcoholService',
          'Confirm whether they are engaged with a drug and alcohol service',
        )
      })

      it('includes a validation error for _requiresSubstituteMedication_', () => {
        expect(page.errors()).toHaveProperty(
          'requiresSubstituteMedication',
          'Confirm whether they require substitute medication',
        )
      })
    })

    describe('when _usesIllegalSubstances_ is YES', () => {
      const page = new SubstanceMisuse({ usesIllegalSubstances: 'yes' }, application)

      describe('and _substanceMisuseHistory_ is UNANSWERED', () => {
        it('includes a validation error for _substanceMisuseHistory_', () => {
          expect(page.errors()).toHaveProperty('substanceMisuseHistory', 'Name the illegal substances they take')
        })
      })

      describe('and _substanceMisuseDetail_ is UNANSWERED', () => {
        it('includes a validation error for _substanceMisuseDetail_', () => {
          expect(page.errors()).toHaveProperty(
            'substanceMisuseDetail',
            'Describe how often they take substances, by what method and how much',
          )
        })
      })
    })

    describe('when _engagedWithDrugAndAlcoholService_ is YES', () => {
      const page = new SubstanceMisuse({ engagedWithDrugAndAlcoholService: 'yes' }, application)

      describe('and _drugAndAlcoholServiceDetail_ is UNANSWERED', () => {
        it('includes a validation error for _drugAndAlcoholServiceDetail_', () => {
          expect(page.errors()).toHaveProperty(
            'drugAndAlcoholServiceDetail',
            'Provide the name of the drug and alcohol service',
          )
        })
      })
    })

    describe('when _requiresSubstituteMedication_ is YES', () => {
      const page = new SubstanceMisuse({ requiresSubstituteMedication: 'yes' }, application)

      describe('and _substituteMedicationDetail_ is UNANSWERED', () => {
        it('includes a validation error for _substituteMedicationDetail_', () => {
          expect(page.errors()).toHaveProperty(
            'substituteMedicationDetail',
            'Provide details of their substitute medication',
          )
        })
      })
    })
  })
})
