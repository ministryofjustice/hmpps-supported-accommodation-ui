import { Cas2Application as Application } from '@approved-premises/api'
import { SummaryListItem, UiTask, FormSection, TextItem, HtmlItem } from '@approved-premises/ui'
import Apply from '../form-pages/apply/index'
import CheckYourAnswers from '../form-pages/apply/check-your-answers'
import paths from '../paths/apply'
import TaskListPage, { TaskListPageInterface } from 'server/form-pages/taskListPage'
import { SessionDataError, UnknownPageError } from './errors'

export const checkYourAnswersSections = (application: Application) =>
  reviewSections(application, getTaskResponsesAsSummaryListItems)

const getTaskResponsesAsSummaryListItems = (task: UiTask, application: Application): Array<SummaryListItem> => {
  const items: Array<SummaryListItem> = []

  forPagesWithResponsesInTask(application, task, (page, pageName) => {
    const response = page.response()

    Object.keys(response).forEach(key => {
      const value =
        typeof response[key] === 'string' || response[key] instanceof String || response[key] === undefined
          ? ({ html: formatLines(response[key] as string) } as HtmlItem)
          : ({ html: embeddedSummaryListItem(response[key] as Array<Record<string, unknown>>) } as HtmlItem)
      items.push(summaryListItemForResponse(key, value, task, pageName, application))
    })
  })

  return items
}

const reviewSections = (
  application: Application,
  rowFunction: (task: UiTask, application: Application) => Array<SummaryListItem>,
) => {
  const nonCheckYourAnswersSections = getApplySections(true)

  return nonCheckYourAnswersSections.map(section => {
    return {
      title: section.title,
      tasks: section.tasks.map(task => {
        return {
          id: task.id,
          title: task.title,
          rows: rowFunction(task, application),
        }
      }),
    }
  })
}

const getApplySections = (excludeCheckYourAnswers: boolean = false): Array<FormSection> => {
  const sections = Apply.sections

  return excludeCheckYourAnswers ? sections.filter(section => section.name !== CheckYourAnswers.name) : sections
}

const forPagesWithResponsesInTask = (
  application: Application,
  task: UiTask,
  callback: (page: TaskListPage, pageName: string) => void,
): void => {
  const pageNames = Object.keys(task.pages)
  let pageName = pageNames?.[0]

  while (pageName) {
    const Page = getPage(task.id, pageName)
    const body = application?.data?.[task.id]?.[pageName]

    // if (!body) {
    //   throw new SessionDataError(`No data for page ${task.id}:${pageName}`)
    // }

    const page = new Page(body, application)

    if (Object.keys(page.errors()).length) {
      throw new SessionDataError(`Errors for page ${task.id}:${pageName}`)
    }
    if (Object.keys(page.response()).length > 0) {
      callback(page, pageName)
    }
    pageName = page.next()
  }
}

const getPage = (taskName: string, pageName: string): TaskListPageInterface => {
  const pageList = Apply.pages[taskName]

  const Page = pageList[pageName]

  if (!Page) {
    throw new UnknownPageError(pageName)
  }

  return Page as TaskListPageInterface
}

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
  task: UiTask,
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
          href: paths.applications.pages.show({ task: task.id, page: pageName, id: application.id }),
          text: 'Change',
          visuallyHiddenText: key,
        },
      ],
    },
  }
}
