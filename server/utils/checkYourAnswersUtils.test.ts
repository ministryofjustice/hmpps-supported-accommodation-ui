import { SummaryListItem } from '@approved-premises/ui'
import { applicationFactory, personFactory } from '../testutils/factories'
import * as checkYourAnswersUtils from './checkYourAnswersUtils'
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
  getTaskAnswersAsSummaryListItems,
  addPageAnswersToItemsArray,
  arrayAnswersAsString,
  getAnswer,
  summaryListItemForQuestion,
  checkYourAnswersSections,
  getAcctMetadata,
  getSectionsWithAnswers,
} = checkYourAnswersUtils

const { getQuestions } = getQuestionsUtil

describe('checkYourAnswersUtils', () => {
  const person = personFactory.build({ name: 'Roger Smith' })

  const questions = getQuestions(person.name)

  const application = applicationFactory.build({
    person,
    data: applicationData,
  })

  describe('checkYourAnswersSections', () => {
    it('returns an array of section tiles', () => {
      const sections = [
        { name: 'section1', tasks: [{ id: 'task1', pages: {}, title: 'Task 1' }], title: 'Section 1' },
        { name: 'section2', tasks: [{ id: 'task2', pages: {}, title: 'Task 2' }], title: 'Section 2' },
      ]

      jest.spyOn(checkYourAnswersUtils, 'getSectionsWithAnswers').mockImplementationOnce(jest.fn(() => sections))
      jest.spyOn(checkYourAnswersUtils, 'getTaskAnswersAsSummaryListItems').mockImplementation(jest.fn(() => []))

      const expected = [
        { title: 'Section 1', tasks: [{ id: 'task1', title: 'Task 1', rows: [] as Array<SummaryListItem> }] },
        { title: 'Section 2', tasks: [{ id: 'task2', title: 'Task 2', rows: [] as Array<SummaryListItem> }] },
      ]

      expect(checkYourAnswersSections(application)).toEqual(expected)

      jest.clearAllMocks()
    })
  })

  describe('getTaskAnswersAsSummaryListItems', () => {
    it('returns an array of summary list items for a given task', () => {
      jest.spyOn(getQuestionsUtil, 'getQuestions').mockImplementationOnce(jest.fn(() => mockQuestions))
      ;(formatLines as jest.MockedFunction<typeof formatLines>).mockImplementation(text => text)

      const application = applicationFactory.build({
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
                href: `/applications/${application.id}/tasks/task1/pages/page1`,
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
                href: `/applications/${application.id}/tasks/task1/pages/page2`,
                text: 'Change',
                visuallyHiddenText: 'Another question',
              },
            ],
          },
        },
      ]

      expect(getTaskAnswersAsSummaryListItems('task1', application)).toEqual(expected)
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

      addPageAnswersToItemsArray({
        items,
        application,
        task: 'risk-of-serious-harm',
        pageKey: 'additional-risk-information',
        questions,
      })

      expect(items).toEqual(expected)
    })

    it(`does not add to items array if question keys don't refer to questions`, () => {
      const items: Array<SummaryListItem> = []

      addPageAnswersToItemsArray({
        items,
        application,
        task: 'risk-to-self',
        pageKey: 'oasys-import',
        questions,
      })

      expect(items).toEqual([])
    })

    it('does not add questions to the items array if there is no answer', () => {
      const mockQuestions = {
        task1: {
          page1: {
            question1: { question: 'A question', answers: { yes: 'Yes', no: 'No' } },
            question2: { question: 'Another question' },
          },
        },
      }

      const application = applicationFactory.build({
        data: {
          task1: {
            page1: {
              question1: 'no',
              question2: '',
            },
          },
        },
      })

      ;(formatLines as jest.MockedFunction<typeof formatLines>).mockImplementation(text => text)

      const expected = [
        {
          key: { text: 'A question' },
          value: { html: 'No' },
          actions: {
            items: [
              {
                href: `/applications/${application.id}/tasks/task1/pages/page1`,
                text: 'Change',
                visuallyHiddenText: 'A question',
              },
            ],
          },
        },
      ]

      const items: Array<SummaryListItem> = []

      addPageAnswersToItemsArray({
        items,
        application,
        task: 'task1',
        pageKey: 'page1',
        questions: mockQuestions,
      })

      expect(items).toEqual(expected)
    })
  })

  describe('getAnswer', () => {
    it('returns array answers as string given an array of defined answers', () => {
      const arrayAnswersAsStringSpy = jest.spyOn(checkYourAnswersUtils, 'arrayAnswersAsString')

      getAnswer(application, questions, 'risk-of-serious-harm', 'risk-management-arrangements', 'arrangements')

      expect(arrayAnswersAsStringSpy).toHaveBeenCalledTimes(1)
    })

    it('returns an array answer that is not predefined', () => {
      const expected = {
        'createdDate-day': '1',
        'createdDate-month': '2',
        'createdDate-year': '2012',
        isOngoing: 'no',
        'closedDate-day': '10',
        'closedDate-month': '10',
        'closedDate-year': '2013',
        referringInstitution: 'HMPPS prison',
        acctDetails: 'ACCT details',
      }

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
        summaryListItemForQuestion(application, questions, 'confirm-eligibility', 'confirm-eligibility', 'isEligible'),
      ).toEqual(expected)
    })

    it('returns a summary list item for an ACCT', () => {
      ;(formatLines as jest.MockedFunction<typeof formatLines>).mockImplementation(text => text)

      const expected = {
        key: { html: 'ACCT<br />Created: 1 February 2012<br />Expiry: 10 October 2013' },
        value: { html: 'ACCT details' },
        actions: {
          items: [
            {
              href: `/applications/${application.id}/tasks/risk-to-self/pages/acct`,
              text: 'Change',
              visuallyHiddenText: 'ACCT<br />Created: 1 February 2012<br />Expiry: 10 October 2013',
            },
          ],
        },
      }

      expect(summaryListItemForQuestion(application, questions, 'risk-to-self', 'acct-data', '0')).toEqual(expected)
    })

    it('returns a summary list item for a behaviour note', () => {
      ;(formatLines as jest.MockedFunction<typeof formatLines>).mockImplementation(text => text)

      const expected = {
        key: { text: 'Behaviour note' },
        value: { html: 'some detail' },
        actions: {
          items: [
            {
              href: `/applications/${application.id}/tasks/risk-of-serious-harm/pages/behaviour-notes`,
              text: 'Change',
              visuallyHiddenText: 'Behaviour note',
            },
          ],
        },
      }

      expect(
        summaryListItemForQuestion(application, questions, 'risk-of-serious-harm', 'behaviour-notes-data', '0'),
      ).toEqual(expected)
    })
  })

  describe('getAcctMetadata', () => {
    it('returns a formatted key with an expiry date', () => {
      const acct = {
        'createdDate-day': '1',
        'createdDate-month': '2',
        'createdDate-year': '2012',
        isOngoing: 'no',
        'closedDate-day': '10',
        'closedDate-month': '10',
        'closedDate-year': '2013',
        referringInstitution: 'HMPPS prison',
        acctDetails: 'ACCT details',
      }

      expect(getAcctMetadata(acct)).toEqual('ACCT<br />Created: 1 February 2012<br />Expiry: 10 October 2013')
    })

    it('returns a formatted key without an expiry date', () => {
      const acct = {
        'createdDate-day': '1',
        'createdDate-month': '2',
        'createdDate-year': '2012',
        isOngoing: 'yes',
        referringInstitution: 'HMPPS prison',
        acctDetails: 'ACCT details',
      }

      expect(getAcctMetadata(acct)).toEqual('ACCT<br />Created: 1 February 2012<br />Ongoing')
    })
  })

  describe('getSectionsWithAnswers', () => {
    it('returns all sections except check your answers', () => {
      const sections = getSectionsWithAnswers()

      expect(sections.filter(section => section.name === 'Check your answers')).toHaveLength(0)
    })
  })
})
