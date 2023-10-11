import { Cas2Application as Application } from '@approved-premises/api'
import { SummaryListItem, FormSection } from '@approved-premises/ui'
import Apply from '../form-pages/apply/index'
import CheckYourAnswers from '../form-pages/apply/check-your-answers'
import paths from '../paths/apply'
import { getQuestions } from '../form-pages/utils/questions'
import { nameOrPlaceholderCopy } from './utils'
import { formatLines } from './viewUtils'
import { DateFormats } from './dateUtils'

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

  const pagesKeys = getPages(application, task)

  pagesKeys.forEach(pageKey => {
    addPageAnswersToItemsArray({
      items,
      application,
      task,
      pageKey,
      questions,
    })
  })

  return items
}

export const addPageAnswersToItemsArray = (params: {
  items: Array<SummaryListItem>
  application: Application
  task: string
  pageKey: string
  questions: Record<string, unknown>
}) => {
  const { items, application, task, pageKey, questions } = params
  const questionKeys = Object.keys(application.data[task][pageKey])
  if (containsQuestions(questionKeys)) {
    questionKeys.forEach(questionKey => {
      const item = summaryListItemForQuestion(application, questions, task, pageKey, questionKey)
      item && items.push(item)
    })
  }
}

export const getAnswer = (
  application: Application,
  questions: Record<string, unknown>,
  task: string,
  pageKey: string,
  questionKey: string,
): string | Record<string, unknown> => {
  if (hasDefinedAnswers(questions, task, pageKey, questionKey)) {
    if (Array.isArray(application.data[task][pageKey][questionKey])) {
      return arrayAnswersAsString(application, questions, task, pageKey, questionKey)
    }
    return questions[task][pageKey][questionKey].answers[application.data[task][pageKey][questionKey]]
  }
  return application.data[task][pageKey][questionKey]
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

export const summaryListItemForQuestion = (
  application: Application,
  questions: Record<string, unknown>,
  task: string,
  pageKey: string,
  questionKey: string,
) => {
  const answer = getAnswer(application, questions, task, pageKey, questionKey)

  if (!answer) {
    return null
  }

  if (pageKey === 'acct-data') {
    return {
      key: {
        html: getAcctMetadata(answer as Record<string, string>),
      },
      value: { html: formatLines(answer['acctDetails']) },
      actions: {
        items: [
          {
            href: paths.applications.pages.show({ task: task, page: 'acct', id: application.id }),
            text: 'Change',
            visuallyHiddenText: getAcctMetadata(answer as Record<string, string>),
          },
        ],
      },
    }
  }

  if (pageKey === 'behaviour-notes-data') {
    return {
      key: {
        text: 'Behaviour note',
      },
      value: { html: formatLines(answer['behaviourDetail']) },
      actions: {
        items: [
          {
            href: paths.applications.pages.show({ task: task, page: 'behaviour-notes', id: application.id }),
            text: 'Change',
            visuallyHiddenText: 'Behaviour note',
          },
        ],
      },
    }
  }

  const questionText = questions[task][pageKey]?.[questionKey].question || pageKey

  return {
    key: {
      text: questionText,
    },
    value: { html: formatLines(answer as string) },
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

export const getAcctMetadata = (acct: Record<string, string>): string => {
  const createdDate = DateFormats.dateAndTimeInputsToUiDate(acct, 'createdDate')

  let key = `ACCT<br />Created: ${createdDate}`

  if (acct['isOngoing'] === 'no') {
    const expiryDate = DateFormats.dateAndTimeInputsToUiDate(acct, 'closedDate')
    return (key += `<br />Expiry: ${expiryDate}`)
  }

  return (key += `<br />Ongoing`)
}

export const getSectionsWithAnswers = (): Array<FormSection> => {
  const sections = Apply.sections

  return sections.filter(section => section.name !== CheckYourAnswers.name)
}

export const getPages = (application: Application, task: string) => {
  const pagesKeys = Object.keys(application.data[task])

  return pagesKeys.filter(pageKey => pageKey !== 'summary')
}

const containsQuestions = (questionKeys: Array<string>): boolean => {
  if (!questionKeys.length || (questionKeys.length === 1 && questionKeys[0] === 'oasysImportDate')) {
    return false
  }
  return true
}

const hasDefinedAnswers = (
  questions: Record<string, unknown>,
  task: string,
  pageKey: string,
  questionKey: string,
): boolean => {
  return questions[task][pageKey]?.[questionKey]?.answers
}
