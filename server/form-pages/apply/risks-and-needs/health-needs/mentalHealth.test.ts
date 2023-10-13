import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import MentalHealth from './mentalHealth'

describe('MentalHealth', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  describe('title', () => {
    it('personalises the page title', () => {
      const page = new MentalHealth({}, application)

      expect(page.title).toEqual('Mental health needs for Roger Smith')
    })
  })

  describe('Questions', () => {
    const page = new MentalHealth({}, application)

    describe('hasMentalHealthNeeds', () => {
      it('has a question', () => {
        expect(page.questions.hasMentalHealthNeeds.question).toBeDefined()
      })
      it('has one follow-up question', () => {
        expect(page.questions.needsDetail.question).toBeDefined()
      })
    })

    describe('isEngagedWithCommunity', () => {
      it('has a question', () => {
        expect(page.questions.isEngagedWithCommunity.question).toBeDefined()
      })
      it('has one follow-up question', () => {
        expect(page.questions.servicesDetail.question).toBeDefined()
      })
    })

    describe('hasPrescribedMedication', () => {
      it('has a question', () => {
        expect(page.questions.hasPrescribedMedication.question).toBeDefined()
      })
      it('has 3 follow-up questions', () => {
        expect(page.questions.isInPossessionOfMeds.question).toBeDefined()
        expect(page.questions.medicationDetail.question).toBeDefined()
        expect(page.questions.medicationIssues.question).toBeDefined()
      })
    })
  })

  itShouldHaveNextValue(new MentalHealth({}, application), 'communication-and-language')
  itShouldHavePreviousValue(new MentalHealth({}, application), 'physical-health')

  describe('response', () => {
    it('returns the correct plain english responses for the questions', () => {
      const page = new MentalHealth(
        {
          hasMentalHealthNeeds: 'yes',
          needsDetail: 'Has depression',
          isEngagedWithCommunity: 'yes',
          servicesDetail: 'Attending The Well Clinic',
          hasPrescribedMedication: 'yes',
          isInPossessionOfMeds: 'no',
          medicationDetail: 'anti-epilepsy',
          medicationIssues: 'often forget to take it',
        },
        application,
      )

      expect(page.response()).toEqual({
        'Do they have any mental health needs?': 'Yes',
        'Please describe their mental health needs.': 'Has depression',
        'Are they engaged with any community mental health services?': 'Yes',
        'Please state which services.': 'Attending The Well Clinic',
        'Are they prescribed any medication for their mental health?': 'Yes',
        'Are they in possession of their medication?': 'No',
        'Please list any medications.': 'anti-epilepsy',
        'Please list any issues they have with taking their medication (optional).': 'often forget to take it',
      })
    })
  })

  describe('errors', () => {
    describe('when top-level questions are unanswered', () => {
      const page = new MentalHealth({}, application)

      it('includes a validation error for _hasMentalHealthNeeds_', () => {
        expect(page.errors()).toHaveProperty('hasMentalHealthNeeds', 'Confirm whether they have mental health needs')
      })

      it('includes a validation error for _isEngagedWithCommunity_', () => {
        expect(page.errors()).toHaveProperty('isEngagedWithCommunity', 'Confirm whether they are engaged with services')
      })

      it('includes a validation error for _hasPrescribedMedication_', () => {
        expect(page.errors()).toHaveProperty(
          'hasPrescribedMedication',
          'Confirm whether they are prescribed medication',
        )
      })
    })

    describe('when _hasMentalHealthNeeds_ is YES', () => {
      const page = new MentalHealth({ hasMentalHealthNeeds: 'yes' }, application)

      describe('and _needsDetail_ is UNANSWERED', () => {
        it('includes a validation error for _needsDetail_', () => {
          expect(page.errors()).toHaveProperty('needsDetail', 'Describe mental health needs')
        })
      })
    })

    describe('when _isEngagedWithCommunity_ is YES', () => {
      const page = new MentalHealth({ isEngagedWithCommunity: 'yes' }, application)

      describe('and _servicesDetail_ is UNANSWERED', () => {
        it('includes a validation error for _servicesDetail_', () => {
          expect(page.errors()).toHaveProperty('servicesDetail', 'State the services with which they have engaged')
        })
      })
    })

    describe('when _hasPrescribedMedication_ is YES', () => {
      const page = new MentalHealth({ hasPrescribedMedication: 'yes' }, application)

      describe('and _isInPossessionOfMeds_ is UNANSWERED', () => {
        it('includes a validation error for _isInPossessionOfMeds_', () => {
          expect(page.errors()).toHaveProperty('isInPossessionOfMeds', 'Confirm whether they have their medication')
        })
      })

      describe('and _medicationDetail_ is UNANSWERED', () => {
        it('includes a validation error for _medicationDetail_', () => {
          expect(page.errors()).toHaveProperty('medicationDetail', 'List their mental health medication')
        })
      })

      describe('and _medicationIssues_ is UNANSWERED', () => {
        it('includes NO validation error for _medicationIssues_ (optional)', () => {
          expect(page.errors()).not.toHaveProperty('medicationIssues')
        })
      })
    })
  })
})
