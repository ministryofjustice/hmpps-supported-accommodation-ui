import { Cas2Application as Application } from '@approved-premises/api'
import { SummaryListItem, FormSection, TextItem, HtmlItem } from '@approved-premises/ui'
import Apply from '../form-pages/apply/index'
import CheckYourAnswers from '../form-pages/apply/check-your-answers'
import paths from '../paths/apply'
import getQuestions from '../form-pages/utils/questions'
import { nameOrPlaceholderCopy } from './utils'
import { formatLines } from './viewUtils'
import { escape } from './formUtils'

export const checkYourAnswersSections = (application: Application) => {
  const sectionsWithAnswers = getSectionsWithAnswers()

  return sectionsWithAnswers.map(section => {
    return {
      title: section.title,
      tasks: section.tasks.map(task => {
        return {
          id: task.id,
          title: task.title,
          rows: getTaskAnswersAsSummaryListItems(task.id, application),
        }
      }),
    }
  })
}

export const getTaskAnswersAsSummaryListItems = (task: string, application: Application): Array<SummaryListItem> => {
  const items: Array<SummaryListItem> = []

  const questions = getQuestions(nameOrPlaceholderCopy(application.person))

  const pagesKeys = Object.keys(application.data[task])

  pagesKeys.forEach(pageKey => {
    addPageAnswersToItemsArray(items, application, task, pageKey, questions)
  })

  return items
}

export const addPageAnswersToItemsArray = (
  items: Array<SummaryListItem>,
  application: Application,
  task: string,
  pageKey: string,
  questions: Record<string, unknown>,
) => {
  const questionKeys = Object.keys(application.data[task][pageKey])
  //TEST ME
  if (containsQuestions(questionKeys)) {
    questionKeys.forEach(questionKey => {
      //TEST ME
      // if (isArrayIndex(questionKey) && Number(questionKey) > 0) {
      //   return
      // }
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
    return questions[task][pageKey][questionKey].answers[application.data[task][pageKey][questionKey]]
  } else if (questionKey === '0') {
    return application.data[task][pageKey]
  } else {
    return application.data[task][pageKey][questionKey]
  }
}

const isArrayIndex = (questionKey: string): boolean => {
  if (!isNaN(Number(questionKey))) {
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
    textAnswers.push(questions[task][pageKey][questionKey].answers[answerKey])
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
  const questionText = questions[task][pageKey]?.[questionKey].question || pageKey
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
          href: paths.applications.pages.show({ task: task, page: pageKey, id: application.id }),
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
  return questions[task][pageKey]?.[questionKey].answers
}

const getSectionsWithAnswers = (): Array<FormSection> => {
  const sections = Apply.sections

  return sections.filter(section => section.name !== CheckYourAnswers.name)
}
