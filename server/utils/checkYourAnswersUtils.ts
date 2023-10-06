import { Cas2Application as Application } from '@approved-premises/api'
import { SummaryListItem, FormSection, TextItem, HtmlItem, SummaryListWithCard } from '@approved-premises/ui'
import Apply from '../form-pages/apply/index'
import CheckYourAnswers from '../form-pages/apply/check-your-answers'
import paths from '../paths/apply'
import { getQuestions } from '../form-pages/utils/questions'
import { nameOrPlaceholderCopy } from './utils'
import { formatLines } from './viewUtils'
import { escape } from './formUtils'
import { getPage } from './applications/getPage'
import { AcctDataBody } from '../form-pages/apply/risks-and-needs/risk-to-self/custom-forms/acctData'
import { BehaviourNotesDataBody } from '../form-pages/apply/risks-and-needs/risk-of-serious-harm/custom-forms/behaviourNotesData'

export const checkYourAnswersSections = (application: Application) => {
  const sectionsWithAnswers = getSectionsWithAnswers()

  return sectionsWithAnswers.map(section => {
    return {
      title: section.title,
      tasks: section.tasks.map(task => {
        return {
          id: task.id,
          title: task.title,
          cards: getCardsForTask(task.id, application),
        }
      }),
    }
  })
}

const getCardsForTask = (task: string, application: Application): Array<SummaryListWithCard> => {
  const pagesKeys = Object.keys(application.data?.[task])

  switch (task) {
    case 'equality-and-diversity-monitoring':
      return [
        {
          card: {
            title: {
              text: 'Equality and diversity monitoring questions',
            },
          },
          rows: pagesKeys.map(page => getPageAnswersAsSummaryListRows(page, task, application)).flat(),
        },
      ]
    case 'risk-to-self':
      return [
        {
          card: {
            title: {
              text: 'Vulnerability',
            },
          },
          rows: getPageAnswersAsSummaryListRows('vulnerability', task, application),
        },
        {
          card: {
            title: {
              text: 'Current risk',
            },
          },
          rows: getPageAnswersAsSummaryListRows('current-risk', task, application),
        },
        {
          card: {
            title: {
              text: 'Historical risk',
            },
          },
          rows: getPageAnswersAsSummaryListRows('historical-risk', task, application),
        },
        {
          card: {
            title: {
              text: 'ACCT notes',
            },
          },
          rows: getAcctNotesAsRows(application),
        },
      ]

    case 'risk-of-serious-harm':
      return [
        {
          card: {
            title: {
              text: 'RoSH summary',
            },
          },
          rows: getPageAnswersAsSummaryListRows('summary', task, application),
        },
        {
          card: {
            title: {
              text: 'RoSH questions',
            },
          },
          rows: ['risk-to-others', 'risk-factors', 'reducing-risk']
            .map(page => getPageAnswersAsSummaryListRows(page, task, application))
            .flat(),
        },
        {
          card: {
            title: {
              text: 'Risk management arrangements',
            },
          },
          rows: getPageAnswersAsSummaryListRows('risk-management-arrangements', task, application),
        },
        {
          card: {
            title: {
              text: 'Cell share information',
            },
          },
          rows: getPageAnswersAsSummaryListRows('cell-share-information', task, application),
        },
        {
          card: {
            title: {
              text: 'Behaviour notes',
            },
          },
          rows: getBehaviourNotesAsRows(application),
        },
        {
          card: {
            title: {
              text: 'Additional risk information',
            },
          },
          rows: getPageAnswersAsSummaryListRows('additional-risk-information', task, application),
        },
      ]

    default:
      return pagesKeys.map(page => {
        const Page = getPage(task, page, 'applications')
        const body = application.data?.[task]?.[page]
        const formPage = new Page(body, application)

        return {
          card: {
            title: {
              text: formPage.title,
            },
          },
          rows: getPageAnswersAsSummaryListRows(page, task, application),
        }
      })
  }
}

const getAcctNotesAsRows = (application: Application): Array<SummaryListItem> => {
  const accts = application.data?.['risk-to-self']['acct-data'] as Array<AcctDataBody>

  if (accts && accts.length > 0) {
    return accts.map(acct => {
      return {
        key: {
          html: `${acct.referringInstitution}<br><span class="govuk-!-font-weight-regular">${
            acct.isOngoing === 'yes' ? 'Ongoing' : 'Closed'
          }</span><br><span class="govuk-!-font-weight-regular">Created: ${
            acct['createdDate-day'] + acct['createdDate-month'] + acct['createdDate-year']
          }<br> Expiry: ${
            acct['closedDate-day'] ? acct['closedDate-day'] + acct['closedDate-month'] + acct['closedDate-year'] : ''
          }</span>`,
        },
        value: {
          text: acct.acctDetails,
        },
      }
    })
  }

  return []
}

const getBehaviourNotesAsRows = (application: Application): Array<SummaryListItem> => {
  const notes = application.data?.['risk-of-serious-harm']['behaviour-notes-data'] as Array<BehaviourNotesDataBody>
  if (notes && notes.length > 0) {
    return notes.map((note, index) => {
      return {
        key: {
          text: `Behaviour note ${index + 1}`,
        },
        value: {
          text: note.behaviourDetail,
        },
      }
    })
  }

  return []
}

const getCardsForPage = (page: string, task: string, application: Application): Array<SummaryListWithCard> => {
  const Page = getPage(task, page, 'applications')
  const body = application.data?.[task]?.[page]
  const formPage = new Page(body, application)
  return [
    {
      card: {
        title: {
          text: formPage.title,
        },
      },
      rows: getPageAnswersAsSummaryListRows(page, task, application),
    },
  ]
}

export const getPageAnswersAsSummaryListRows = (
  page: string,
  task: string,
  application: Application,
): Array<SummaryListItem> => {
  const rows: Array<SummaryListItem> = []

  const questions = getQuestions(nameOrPlaceholderCopy(application.person))

  addPageAnswersToRowsArray(rows, application, task, page, questions)

  return rows
}

export const addPageAnswersToRowsArray = (
  items: Array<SummaryListItem>,
  application: Application,
  task: string,
  pageKey: string,
  questions: Record<string, unknown>,
) => {
  const questionKeys = Object.keys(application.data[task][pageKey])
  // TEST ME
  if (containsQuestions(questionKeys)) {
    questionKeys.forEach(questionKey => {
      if (isArrayIndex(questionKey) && Number(questionKey) > 0) {
        return
      }
      const item = summaryListItemForQuestion(application, questions, task, questionKey, pageKey)
      items.push(item)
    })
  }
}

export const getAnswer = (
  application: Application,
  questions: Record<string, unknown>,
  task: string,
  pageKey: string,
  questionKey: string,
): string | Array<Record<string, unknown>> => {
  if (areDefinedAnswers(questions, task, pageKey, questionKey)) {
    if (Array.isArray(application.data[task][pageKey][questionKey])) {
      return arrayAnswersAsString(application, questions, task, pageKey, questionKey)
    }
    return questions[task][pageKey][questionKey]?.answers[application.data[task][pageKey][questionKey]] || ''
  }
  if (questionKey === '0') {
    return application.data[task][pageKey] || ''
  }
  return application.data[task][pageKey][questionKey] || ''
}

const isArrayIndex = (questionKey: string): boolean => {
  if (!Number.isNaN(Number(questionKey))) {
    return true
  }
  return false
}

export const arrayAnswersAsString = (
  application: Application,
  questions: Record<string, unknown>,
  task: string,
  pageKey: string,
  questionKey: string,
): string => {
  const answerKeys = application.data[task][pageKey][questionKey]
  const textAnswers: Array<string> = []
  answerKeys.forEach((answerKey: string) => {
    textAnswers.push(questions[task][pageKey][questionKey]?.answers[answerKey])
  })
  return textAnswers.join()
}

export const embeddedSummaryListItem = (answers: Array<Record<string, unknown>>): string => {
  let response = ''

  answers.forEach(answer => {
    response += '<dl class="govuk-summary-list govuk-summary-list--embedded">'
    Object.keys(answer).forEach(key => {
      response += `
          <div class="govuk-summary-list__row govuk-summary-list__row--embedded">
            <dt class="govuk-summary-list__key govuk-summary-list__key--embedded">
             ${escape(key)}
            </dt>
            <dd class="govuk-summary-list__value govuk-summary-list__value--embedded">
            ${escape(answer[key] as string)}
            </dd>
          </div>
          `
    })
    response += '</dl>'
  })

  return response
}

export const summaryListItemForQuestion = (
  application: Application,
  questions: Record<string, unknown>,
  task: string,
  questionKey: string,
  pageKey: string,
) => {
  const questionText = questions[task][pageKey]?.[questionKey]?.question || pageKey
  const answer = getAnswer(application, questions, task, pageKey, questionKey)
  const value =
    typeof answer === 'string' || answer instanceof String
      ? ({ html: formatLines(answer as string) } as HtmlItem)
      : ({ html: embeddedSummaryListItem(answer as Array<Record<string, unknown>>) } as HtmlItem)

  return {
    key: {
      text: questionText,
    },
    value,
    actions: {
      items: [
        {
          href: paths.applications.pages.show({ task, page: pageKey, id: application.id }),
          text: 'Change',
          visuallyHiddenText: questionText,
        },
      ],
    },
  }
}

const containsQuestions = (questionKeys: Array<string>): boolean => {
  if (!questionKeys.length || (questionKeys.length === 1 && questionKeys[0] === 'oasysImportDate')) {
    return false
  }
  return true
}

const areDefinedAnswers = (
  questions: Record<string, unknown>,
  task: string,
  pageKey: string,
  questionKey: string,
): boolean => {
  return questions[task][pageKey]?.[questionKey]?.answers
}

const getSectionsWithAnswers = (): Array<FormSection> => {
  const { sections } = Apply

  return sections.filter(section => section.name !== CheckYourAnswers.name)
}
