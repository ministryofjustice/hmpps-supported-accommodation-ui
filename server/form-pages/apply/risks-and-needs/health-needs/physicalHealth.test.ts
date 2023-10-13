import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import PhysicalHealth from './physicalHealth'

describe('PhysicalHealth', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  describe('title', () => {
    it('personalises the page title', () => {
      const page = new PhysicalHealth({}, application)

      expect(page.title).toEqual('Physical health needs for Roger Smith')
    })
  })

  itShouldHaveNextValue(new PhysicalHealth({}, application), 'mental-health')
  itShouldHavePreviousValue(new PhysicalHealth({}, application), 'substance-misuse')

  describe('Questions', () => {
    const page = new PhysicalHealth({}, application)

    describe('hasPhyHealthNeeds', () => {
      it('has a question', () => {
        expect(page.questions.hasPhyHealthNeeds.question).toBeDefined()
      })
      it('has two follow-up questions', () => {
        expect(page.questions.needsDetail.question).toBeDefined()
        expect(page.questions.canClimbStairs.question).toBeDefined()
      })
    })

    describe('isReceivingTreatment', () => {
      it('has a question', () => {
        expect(page.questions.isReceivingTreatment.question).toBeDefined()
      })
      it('has a follow-up question', () => {
        expect(page.questions.treatmentDetail.question).toBeDefined()
      })
    })

    describe('hasPhyHealthMedication', () => {
      it('has a question', () => {
        expect(page.questions.hasPhyHealthMedication.question).toBeDefined()
      })
      it('has a follow-up question', () => {
        expect(page.questions.medicationDetail.question).toBeDefined()
      })
    })

    describe('canLiveIndependently', () => {
      it('has a question', () => {
        expect(page.questions.canLiveIndependently.question).toBeDefined()
      })
      it('has a follow-up question', () => {
        expect(page.questions.indyLivingDetail.question).toBeDefined()
      })
    })

    describe('requiresAdditionalSupport', () => {
      it('has a question', () => {
        expect(page.questions.requiresAdditionalSupport.question).toBeDefined()
      })
      it('has a follow-up question', () => {
        expect(page.questions.addSupportDetail.question).toBeDefined()
      })
    })
  })

  describe('response', () => {
    it('returns the correct plain english responses for the questions', () => {
      const page = new PhysicalHealth(
        {
          hasPhyHealthNeeds: 'yes',
          needsDetail: 'Has reduced mobility',
          canClimbStairs: 'yes',
          isReceivingTreatment: 'yes',
          treatmentDetail: 'Receives physiotherapy',
          hasPhyHealthMedication: 'yes',
          medicationDetail: 'Oral anti-inflammatories',
          canLiveIndependently: 'no',
          indyLivingDetail: 'Requires assistance with bathing',
          requiresAdditionalSupport: 'yes',
          addSupportDetail: 'Needs help with cooking and nutrition',
        },
        application,
      )

      expect(page.response()).toEqual({
        'Do they have any physical health needs?': 'Yes',
        'Please describe their needs.': 'Has reduced mobility',
        'Can they climb stairs?': 'Yes',
        'Are they currently receiving any medical treatment for their physical health needs?': 'Yes',
        'Describe the treatment they receive for physical health needs': 'Receives physiotherapy',
        'Are they currently receiving any medication for their physical health needs?': 'Yes',
        'Describe the medication they receive for physical health needs': 'Oral anti-inflammatories',
        'Can they live independently?': 'No',
        'Describe why they are unable to live independently': 'Requires assistance with bathing',
        'Do they require any additional support?': 'Yes',
        'Please describe the types of support.': 'Needs help with cooking and nutrition',
      })
    })
  })

  describe('errors', () => {
    describe('when top-level questions are unanswered', () => {
      const page = new PhysicalHealth({}, application)

      it('includes a validation error for _hasPhyHealthNeeds_', () => {
        expect(page.errors()).toHaveProperty('hasPhyHealthNeeds', 'Confirm whether they have physical health needs')
      })

      it('includes a validation error for _isReceivingTreatment_', () => {
        expect(page.errors()).toHaveProperty(
          'isReceivingTreatment',
          'Confirm whether they currently receiving treatment',
        )
      })

      it('includes a validation error for _hasPhyHealthMedication_', () => {
        expect(page.errors()).toHaveProperty(
          'hasPhyHealthMedication',
          'Confirm whether they are currently receiving medication',
        )
      })

      it('includes a validation error for _canLiveIndependently_', () => {
        expect(page.errors()).toHaveProperty('canLiveIndependently', 'Confirm whether they can live independently')
      })

      it('includes a validation error for _requiresAdditionalSupport_', () => {
        expect(page.errors()).toHaveProperty(
          'requiresAdditionalSupport',
          'Confirm whether they require additional support',
        )
      })
    })

    describe('when _hasPhyHealthNeeds_ is YES', () => {
      const page = new PhysicalHealth({ hasPhyHealthNeeds: 'yes' }, application)

      describe('and _needsDetail_ is UNANSWERED', () => {
        it('includes a validation error for _needsDetail_', () => {
          expect(page.errors()).toHaveProperty('needsDetail', 'Describe physical health needs')
        })
      })

      describe('and _canClimbStairs_ is UNANSWERED', () => {
        it('includes a validation error for _canClimbStairs_', () => {
          expect(page.errors()).toHaveProperty('canClimbStairs', 'Confirm whether they can climb stairs')
        })
      })
    })

    describe('when _isReceivingTreatment_ is YES', () => {
      const page = new PhysicalHealth({ isReceivingTreatment: 'yes' }, application)

      describe('and _treatmentDetail_ is UNANSWERED', () => {
        it('includes a validation error for _treatmentDetail_', () => {
          expect(page.errors()).toHaveProperty('treatmentDetail', 'Describe their treatment')
        })
      })
    })

    describe('when _hasPhyHealthMedication_ is YES', () => {
      const page = new PhysicalHealth({ hasPhyHealthMedication: 'yes' }, application)

      describe('and _medicationDetail_ is UNANSWERED', () => {
        it('includes a validation error for _medicationDetail_', () => {
          expect(page.errors()).toHaveProperty('medicationDetail', 'Describe their medication')
        })
      })
    })

    describe('when _canLiveIndependently_ is NO', () => {
      const page = new PhysicalHealth({ canLiveIndependently: 'no' }, application)

      describe('and _indyLivingDetail_ is UNANSWERED', () => {
        it('includes a validation error for _indyLivingDetail_', () => {
          expect(page.errors()).toHaveProperty('indyLivingDetail', 'Describe why they are unable to live independently')
        })
      })
    })

    describe('when _requiresAdditionalSupport_ is YES', () => {
      const page = new PhysicalHealth({ requiresAdditionalSupport: 'yes' }, application)

      describe('and _addSupportDetail_ is UNANSWERED', () => {
        it('includes a validation error for _addSupportDetail_', () => {
          expect(page.errors()).toHaveProperty('addSupportDetail', 'Describe the support required')
        })
      })
    })
  })
})
