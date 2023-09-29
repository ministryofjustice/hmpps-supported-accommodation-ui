import { Cas2Application as Application } from '@approved-premises/api'
import { SummaryListItem, UiTask, FormSection, TextItem, HtmlItem } from '@approved-premises/ui'
import Apply from '../form-pages/apply/index'
import CheckYourAnswers from '../form-pages/apply/check-your-answers'
import paths from '../paths/apply'
import TaskListPage, { TaskListPageInterface } from 'server/form-pages/taskListPage'
import { SessionDataError, UnknownPageError } from './errors'
import getQuestions from '../form-pages/utils/questions'
import { nameOrPlaceholderCopy } from './utils'

export const checkYourAnswersSections = (application: Application) => {
  const sectionsWithAnswers = getSectionsWithAnswers()

  return sectionsWithAnswers.map(section => {
    return {
      title: section.title,
      tasks: section.tasks.map(task => {
        return {
          id: task.id,
          title: task.title,
          rows: getTaskResponsesAsSummaryListItems(task.id, application),
        }
      }),
    }
  })
}

export const getTaskResponsesAsSummaryListItems = (task: string, application: Application): Array<SummaryListItem> => {
  const items: Array<SummaryListItem> = []

  const questions = getQuestions(nameOrPlaceholderCopy(application.person))

  const pagesKeys = Object.keys(application.data[task])

  pagesKeys.forEach(pageKey => {
    if (task === 'risk-of-serious-harm' && pageKey === 'summary') {
      //handle
    } else {
      const questionKeys = Object.keys(application.data[task][pageKey])
      // ignore if page contains no questions, or an oasys import date
      if (questionKeys.length && questionKeys[0] !== 'oasysImportDate') {
        questionKeys.forEach(questionKey => {
          const questionText = questions[task][pageKey]?.[questionKey].question || pageKey
          const answer = getAnswerUsingKeyIfPredefined(application, questions, task, pageKey, questionKey)
          // if answer is string, format lines, if it's an array of objects, handle otherwise
          const value =
            typeof answer === 'string' || answer instanceof String
              ? ({ html: formatLines(answer as string) } as HtmlItem)
              : ({ html: embeddedSummaryListItem(answer as Array<Record<string, unknown>>) } as HtmlItem)
          items.push(summaryListItemForResponse(questionText, value, task, pageKey, application))
        })
      }
    }
  })

  return items
}

const getAnswerUsingKeyIfPredefined = (
  application: Application,
  questions: Record<string, unknown>,
  task: string,
  pageKey: string,
  questionKey: string | number,
): string | Array<Record<string, unknown>> => {
  if (questions[task][pageKey]?.[questionKey].answers) {
    // handle case where answers are an array of strings e.g. risk management arrangements
    if (Array.isArray(application.data[task][pageKey][questionKey])) {
      const answerKeys = application.data[task][pageKey][questionKey]
      const textAnswers: Array<string> = []
      answerKeys.forEach((answerKey: string) => {
        textAnswers.push(questions[task][pageKey][questionKey].answers[answerKey])
      })
      return textAnswers.join()
    }
    return questions[task][pageKey][questionKey].answers[application.data[task][pageKey][questionKey]]
  } else if (questionKey !== '0') {
    return application.data[task][pageKey][questionKey]
  } else {
    return application.data[task][pageKey]
  }
}

const getSectionsWithAnswers = (): Array<FormSection> => {
  const sections = Apply.sections

  return sections.filter(section => section.name !== CheckYourAnswers.name)
}

// const forPagesWithResponsesInTask = (
//   application: Application,
//   task: UiTask,
//   callback: (page: TaskListPage, pageName: string) => void,
// ): void => {
//   const pageNames = Object.keys(task.pages)
//   let pageName = pageNames?.[0]

//   while (pageName) {
//     const Page = getPage(task.id, pageName)
//     const body = application?.data?.[task.id]?.[pageName]

//     // if (!body) {
//     //   throw new SessionDataError(`No data for page ${task.id}:${pageName}`)
//     // }

//     const page = new Page(body, application)

//     if (Object.keys(page.errors()).length) {
//       throw new SessionDataError(`Errors for page ${task.id}:${pageName}`)
//     }
//     if (Object.keys(page.response()).length > 0) {
//       callback(page, pageName)
//     }
//     pageName = page.next()
//   }
// }

// const getPage = (taskName: string, pageName: string): TaskListPageInterface => {
//   const pageList = Apply.pages[taskName]

//   const Page = pageList[pageName]

//   if (!Page) {
//     throw new UnknownPageError(pageName)
//   }

//   return Page as TaskListPageInterface
// }

const formatLines = (text: string): string => {
  if (!text) {
    return ''
  }

  const normalizedText = normalizeText(text)

  const paragraphs = normalizedText.split('\n\n').map(paragraph => paragraph.split('\n').join('<br />'))

  if (paragraphs.length === 1) {
    return paragraphs[0]
  }
  return `<p>${paragraphs.join('</p><p>')}</p>`
}

function normalizeText(text: string): string {
  let output = text.trim()

  output = output.replace(/(\r\n)/g, '\n')
  output = output.replace(/(\r)/g, '\n')
  output = output.replace(/(\n){2,}/g, '\n\n')

  return output
}

const embeddedSummaryListItem = (answers: Array<Record<string, unknown>>): string => {
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

const summaryListItemForResponse = (
  key: string,
  value: TextItem | HtmlItem,
  task: string,
  pageName: string,
  application: Application,
) => {
  return {
    key: {
      text: key,
    },
    value,
    actions: {
      items: [
        {
          href: paths.applications.pages.show({ task: task, page: pageName, id: application.id }),
          text: 'Change',
          visuallyHiddenText: key,
        },
      ],
    },
  }
}
