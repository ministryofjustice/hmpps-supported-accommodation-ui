import { applicationFactory, personFactory } from '../testutils/factories'
import * as checkYourAnswersUtils from './checkYourAnswersUtils'
import { escape } from './formUtils'
import getQuestions from '../form-pages/utils/questions'
import { formatLines } from './viewUtils'
import applicationData from '../../integration_tests/fixtures/applicationData.json'

jest.mock('./formUtils')
jest.mock('./viewUtils')

const { arrayAnswersAsString, embeddedSummaryListItem, getAnswer, summaryListItemForQuestion } = checkYourAnswersUtils

describe('checkYourAnswersUtils', () => {
  const person = personFactory.build({ name: 'Roger Smith' })

  const questions = getQuestions(person.name)

  const application = applicationFactory.build({
    person,
    data: applicationData,
  })

  describe('addPageAnswersToItemsArray', () => {
    it('adds each page answer to the items array by default', () => {})
  })

  describe('getAnswer', () => {
    it('returns array answers as string given an array of defined answers', () => {
      const arrayAnswersAsStringSpy = jest.spyOn(checkYourAnswersUtils, 'arrayAnswersAsString')

      getAnswer(application, questions, 'risk-of-serious-harm', 'risk-management-arrangements', 'arrangements')

      expect(arrayAnswersAsStringSpy).toHaveBeenCalledTimes(1)
    })

    it('returns the entire page data if question key is 0', () => {
      const expected = [
        {
          'createdDate-day': '1',
          'createdDate-month': '2',
          'createdDate-year': '2012',
          isOngoing: 'no',
          'closedDate-day': '10',
          'closedDate-month': '10',
          'closedDate-year': '2013',
          referringInstitution: 'HMPPS prison',
          acctDetails: 'ACCT details',
        },
      ]

      expect(getAnswer(application, questions, 'risk-to-self', 'acct-data', '0')).toEqual(expected)
    })

    it('returns the answer string by default', () => {
      expect(getAnswer(application, questions, 'confirm-eligibility', 'confirm-eligibility', 'isEligible')).toEqual(
        'Yes, I confirm Roger Smith is eligible',
      )
    })
  })

  describe('arrayAnswersAsString', () => {
    it('returns an array of string answers as a comma separated string', () => {
      expect(
        arrayAnswersAsString(
          application,
          questions,
          'risk-of-serious-harm',
          'risk-management-arrangements',
          'arrangements',
        ),
      ).toEqual('MAPPA,MARAC,IOM')
    })
  })

  describe('summaryListItemForQuestion', () => {
    it('returns a summary list item for a given question', () => {
      ;(formatLines as jest.MockedFunction<typeof formatLines>).mockImplementation(text => text)

      const expected = {
        key: { text: 'Is Roger Smith eligible for Short-Term Accommodation (CAS-2)?' },
        value: { html: 'Yes, I confirm Roger Smith is eligible' },
        actions: {
          items: [
            {
              href: `/applications/${application.id}/tasks/confirm-eligibility/pages/confirm-eligibility`,
              text: 'Change',
              visuallyHiddenText: 'Is Roger Smith eligible for Short-Term Accommodation (CAS-2)?',
            },
          ],
        },
      }

      expect(
        summaryListItemForQuestion(application, questions, 'confirm-eligibility', 'isEligible', 'confirm-eligibility'),
      ).toEqual(expected)
    })
  })

  describe('embeddedSummaryListItem', () => {
    it('returns a summary list for an array of records', () => {
      ;(escape as jest.Mock).mockImplementation((value: string) => `Escaped "${value}"`)

      const result = embeddedSummaryListItem([
        { foo: 'bar', bar: 'baz' },
        { foo: 'bar', bar: 'baz' },
      ]).replace(/\s+/g, ``)

      expect(escape).toHaveBeenCalledWith('foo')
      expect(escape).toHaveBeenCalledWith('bar')
      expect(escape).toHaveBeenCalledWith('baz')
      expect(result).toEqual(
        `
        <dl class="govuk-summary-list govuk-summary-list--embedded">
          <div class="govuk-summary-list__row govuk-summary-list__row--embedded">
            <dt class="govuk-summary-list__key govuk-summary-list__key--embedded">
              Escaped "foo"
            </dt>
            <dd class="govuk-summary-list__value govuk-summary-list__value--embedded">
              Escaped "bar"
            </dd>
          </div>
          <div class="govuk-summary-list__row govuk-summary-list__row--embedded">
            <dt class="govuk-summary-list__key govuk-summary-list__key--embedded">
              Escaped "bar"
            </dt>
            <dd class="govuk-summary-list__value govuk-summary-list__value--embedded">
              Escaped "baz"
            </dd>
          </div>
        </dl>
  
        <dl class="govuk-summary-list govuk-summary-list--embedded">
          <div class="govuk-summary-list__row govuk-summary-list__row--embedded">
            <dt class="govuk-summary-list__key govuk-summary-list__key--embedded">
              Escaped "foo"
            </dt>
            <dd class="govuk-summary-list__value govuk-summary-list__value--embedded">
              Escaped "bar"
            </dd>
          </div>
          <div class="govuk-summary-list__row govuk-summary-list__row--embedded">
            <dt class="govuk-summary-list__key govuk-summary-list__key--embedded">
              Escaped "bar"
            </dt>
            <dd class="govuk-summary-list__value govuk-summary-list__value--embedded">
              Escaped "baz"
            </dd>
          </div>
        </dl>`.replace(/\s+/g, ``),
      )
    })
  })
})
