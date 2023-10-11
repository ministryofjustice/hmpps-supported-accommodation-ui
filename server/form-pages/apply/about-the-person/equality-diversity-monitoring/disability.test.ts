import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import Disability, { DisabilityBody } from './disability'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'

describe('Disability', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  describe('title', () => {
    it('personalises the page title', () => {
      const page = new Disability({ hasDisability: 'yes' }, application)

      expect(page.title).toEqual('Equality and diversity questions for Roger Smith')
    })
  })

  itShouldHaveNextValue(new Disability({ hasDisability: 'yes' }, application), 'sex-and-gender')
  itShouldHavePreviousValue(new Disability({ hasDisability: 'yes' }, application), 'will-answer-equality-questions')

  describe('response', () => {
    it('Adds selected option to page response in _translated_ form', () => {
      const page = new Disability(
        {
          hasDisability: 'yes',
          typeOfDisability: ['physicalImpairment', 'other'],
          otherDisability: 'another disability',
        },
        application,
      )

      expect(page.response()).toEqual({
        'Does Roger Smith have a disability?': 'Yes',
        'What type of disability?': ['Physical impairment', 'Other'],
        'What is the disability?': 'another disability',
      })
    })

    it('ignores fields that are not relevant', () => {
      const page = new Disability(
        {
          hasDisability: 'no',
        },
        application,
      )

      expect(page.response()).toEqual({
        'Does Roger Smith have a disability?': 'No',
      })
    })
  })

  describe('items', () => {
    it('returns the radio with the expected label text', () => {
      const page = new Disability(
        {
          hasDisability: 'yes',
          typeOfDisability: ['physicalImpairment', 'other'],
          otherDisability: 'another disability',
        },
        application,
      )

      expect(page.items('conditionalHtml')).toEqual([
        {
          value: 'yes',
          text: 'Yes',
          checked: true,
          conditional: {
            html: 'conditionalHtml',
          },
        },
        {
          value: 'no',
          text: 'No',
          checked: false,
        },
        {
          divider: 'or',
        },
        {
          value: 'preferNotToSay',
          text: 'Prefer not to say',
          checked: false,
        },
      ])
    })
  })

  describe('typeOfDisabilityItems', () => {
    it('returns the checkboxes with conditional text input', () => {
      const page = new Disability(
        {
          hasDisability: 'yes',
          typeOfDisability: ['physicalImpairment', 'other'],
          otherDisability: 'another disability',
        },
        application,
      )

      expect(page.typeOfDisabilityItems(`some html`)).toEqual([
        {
          value: 'sensoryImpairment',
          text: 'Sensory impairment',
          checked: false,
        },
        {
          value: 'physicalImpairment',
          text: 'Physical impairment',
          checked: true,
        },
        {
          value: 'learningDisability',
          text: 'Learning disability or difficulty',
          checked: false,
        },
        {
          value: 'mentalHealth',
          text: 'Mental health condition',
          checked: false,
        },
        {
          value: 'illness',
          text: 'Long-standing illness',
          checked: false,
        },
        {
          value: 'other',
          text: 'Other',
          checked: true,
          conditional: { html: `some html` },
        },
      ])
    })
  })

  describe('errors', () => {
    const validAnswers = [
      {
        hasDisability: 'no',
      },
      {
        hasDisability: 'preferNotToSay',
      },
      {
        hasDisability: 'yes',
        typeOfDisability: 'sensoryImpairment',
      },
      {
        hasDisability: 'yes',
        typeOfDisability: 'other',
        otherDisability: 'something',
      },
    ]
    it.each(validAnswers)('it does not return an error for valid answers', validAnswer => {
      const page = new Disability(validAnswer as DisabilityBody, application)

      expect(page.errors()).toEqual({})
    })

    it('should return errors when no answer given', () => {
      const page = new Disability({}, application)

      expect(page.errors()).toEqual({
        hasDisability: 'Choose either Yes, No or Prefer not to say',
      })
    })

    it('should return errors when hasDisability is entered but the disability is not specified', () => {
      const page = new Disability(
        {
          hasDisability: 'yes',
        },
        application,
      )

      expect(page.errors()).toEqual({
        typeOfDisability: 'Choose a disability type',
      })
    })

    it('should return errors when user selects other disability but does not specify', () => {
      const page = new Disability(
        {
          hasDisability: 'yes',
          typeOfDisability: ['other'],
        },
        application,
      )

      expect(page.errors()).toEqual({
        otherDisability: 'Enter the other disability',
      })
    })
  })
})
