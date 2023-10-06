import { SummaryListItem } from '@approved-premises/ui'
import { applicationFactory, personFactory } from '../testutils/factories'
import * as checkYourAnswersUtils from './checkYourAnswersUtils'
import { escape } from './formUtils'
import * as getQuestionsUtil from '../form-pages/utils/questions'
import { formatLines } from './viewUtils'
import applicationData from '../../integration_tests/fixtures/applicationData.json'

const mockQuestions = {
  task1: {
    page1: { question1: { question: 'A question', answers: { yes: 'Yes', no: 'No' } } },
    page2: { question2: { question: 'Another question' } },
  },
  task2: {
    page1: { question1: { question: 'question 3', answers: { yes: 'Yes', no: 'No' } } },
    page2: { question2: { question: 'question 4' } },
  },
}

jest.mock('./formUtils')
jest.mock('./viewUtils')

const {
  getTaskAnswersAsSummaryLists: getTaskAnswersAsSummaryListItems,
  addPageAnswersAsRowsArray: addPageAnswersToItemsArray,
  arrayAnswersAsString,
  embeddedSummaryListItem,
  getAnswer,
  summaryListRowsForQuestion: summaryListItemForQuestion,
} = checkYourAnswersUtils

const { getQuestions } = getQuestionsUtil

describe('checkYourAnswersUtils', () => {
  const person = personFactory.build({ name: 'Roger Smith' })

  const questions = getQuestions(person.name)

  const application = applicationFactory.build({
    person,
    data: applicationData,
  })

  describe('getTaskAnswersAsSummaryListItems', () => {
    it('returns an array of summary list items for a given task', () => {
      jest.spyOn(getQuestionsUtil, 'getQuestions').mockImplementationOnce(jest.fn(() => mockQuestions))
      ;(formatLines as jest.MockedFunction<typeof formatLines>).mockImplementation(text => text)

      const applicationWithMockData = applicationFactory.build({
        data: {
          task1: {
            page1: {
              question1: 'no',
            },
            page2: {
              question2: 'some answer',
            },
          },
        },
      })

      const expected = [
        {
          key: { text: 'A question' },
          value: { html: 'No' },
          actions: {
            items: [
              {
                href: `/applications/${applicationWithMockData.id}/tasks/task1/pages/page1`,
                text: 'Change',
                visuallyHiddenText: 'A question',
              },
            ],
          },
        },
        {
          key: { text: 'Another question' },
          value: { html: 'some answer' },
          actions: {
            items: [
              {
                href: `/applications/${applicationWithMockData.id}/tasks/task1/pages/page2`,
                text: 'Change',
                visuallyHiddenText: 'Another question',
              },
            ],
          },
        },
      ]

      expect(getTaskAnswersAsSummaryListItems('task1', applicationWithMockData)).toEqual(expected)
    })
  })

  describe('addPageAnswersToItemsArray', () => {
    it('adds each page answer to the items array by default', () => {
      const items: Array<SummaryListItem> = []

      const expected = [
        {
          key: { text: 'Is there any other risk information for Roger Smith?' },
          value: { html: 'Yes' },
          actions: {
            items: [
              {
                href: `/applications/${application.id}/tasks/risk-of-serious-harm/pages/additional-risk-information`,
                text: 'Change',
                visuallyHiddenText: 'Is there any other risk information for Roger Smith?',
              },
            ],
          },
        },
        {
          key: { text: 'Additional information' },
          value: { html: 'some information' },
          actions: {
            items: [
              {
                href: `/applications/${application.id}/tasks/risk-of-serious-harm/pages/additional-risk-information`,
                text: 'Change',
                visuallyHiddenText: 'Additional information',
              },
            ],
          },
        },
      ]

      ;(formatLines as jest.MockedFunction<typeof formatLines>).mockImplementation(text => text)

      addPageAnswersToItemsArray(items, application, 'risk-of-serious-harm', 'additional-risk-information', questions)

      expect(items).toEqual(expected)
    })

    it(`does not add to items array if question keys don't refer to questions`, () => {
      const items: Array<SummaryListItem> = []

      addPageAnswersToItemsArray(items, application, 'risk-to-self', 'oasys-import', questions)

      expect(items).toEqual([])
    })

    it('does not duplicate embedded list item for array answers', () => {
      const items: Array<SummaryListItem> = []

      addPageAnswersToItemsArray(items, application, 'risk-to-self', 'acct-data', questions)

      expect(items.length).toEqual(1)
    })
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
        {
          'createdDate-day': '2',
          'createdDate-month': '3',
          'createdDate-year': '2013',
          isOngoing: 'yes',
          referringInstitution: 'HMPPS prison 2',
          acctDetails: 'ACCT details 2',
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
