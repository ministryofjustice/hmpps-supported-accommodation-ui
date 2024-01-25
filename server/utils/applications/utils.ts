import type { ApplicationDocument, FormPages, JourneyType, UiTimelineEvent } from '@approved-premises/ui'
import type { Cas2Application as Application, Cas2StatusUpdate, Cas2SubmittedApplication } from '@approved-premises/api'
import Apply from '../../form-pages/apply'
import paths from '../../paths/apply'
import { DateFormats } from '../dateUtils'
import { getSections } from '../checkYourAnswersUtils'

export const journeyPages = (_journeyType: JourneyType): FormPages => {
  return Apply.pages
}

export const firstPageOfBeforeYouStartSection = (application: Application) => {
  return paths.applications.pages.show({ id: application.id, task: 'confirm-eligibility', page: 'confirm-eligibility' })
}

export const eligibilityQuestionIsAnswered = (application: Application): boolean => {
  return eligibilityAnswer(application) === 'yes' || eligibilityAnswer(application) === 'no'
}

export const eligibilityIsConfirmed = (application: Application): boolean => {
  return eligibilityAnswer(application) === 'yes'
}
export const eligibilityIsDenied = (application: Application): boolean => {
  return eligibilityAnswer(application) === 'no'
}

const eligibilityAnswer = (application: Application): string => {
  return application.data?.['confirm-eligibility']?.['confirm-eligibility']?.isEligible
}

export const firstPageOfConsentTask = (application: Application) => {
  return paths.applications.pages.show({ id: application.id, task: 'confirm-consent', page: 'confirm-consent' })
}

export const consentIsConfirmed = (application: Application): boolean => {
  return consentAnswer(application) === 'yes'
}
export const consentIsDenied = (application: Application): boolean => {
  return consentAnswer(application) === 'no'
}

const consentAnswer = (application: Application): string => {
  return application.data?.['confirm-consent']?.['confirm-consent']?.hasGivenConsent
}

export const getStatusTimelineEvents = (statusUpdates: Array<Cas2StatusUpdate>): Array<UiTimelineEvent> => {
  if (statusUpdates) {
    return statusUpdates
      .sort((a, b) => Number(DateFormats.isoToDateObj(b.updatedAt)) - Number(DateFormats.isoToDateObj(a.updatedAt)))
      .map(statusUpdate => {
        return {
          label: { text: statusUpdate.label },
          byline: {
            text: statusUpdate.updatedBy.name,
          },
          datetime: {
            timestamp: statusUpdate.updatedAt,
            date: DateFormats.isoDateTimeToUIDateTime(statusUpdate.updatedAt),
          },
          description: {
            text: statusUpdate.description,
          },
        }
      })
  }
  return []
}

export const getSubmittedTimelineEvent = (submitterName: string, submittedAt: string): UiTimelineEvent => {
  return {
    label: { text: 'Application submitted' },
    byline: {
      text: submitterName,
    },
    datetime: {
      timestamp: submittedAt,
      date: DateFormats.isoDateTimeToUIDateTime(submittedAt),
    },
    description: {
      text: 'The application was received by an assessor.',
    },
  }
}

export const getApplicationTimelineEvents = (application: Cas2SubmittedApplication): Array<UiTimelineEvent> => {
  return [
    ...getStatusTimelineEvents(application.statusUpdates),
    getSubmittedTimelineEvent(application.submittedBy.name, application.submittedAt),
  ]
}

export const generateSuccessMessage = (pageName: string): string => {
  switch (pageName) {
    case 'current-offence-data':
      return 'The offence has been saved'
    case 'offence-history-data':
      return 'The offence has been saved'
    case 'behaviour-notes-data':
      return 'The behaviour note has been saved'
    case 'acct-data':
      return 'The ACCT has been saved'
    default:
      return ''
  }
}

export type SideNavItem = {
  text: string
  href: string
}

export const getSideNavLinksForDocument = (document: ApplicationDocument) => {
  const tasks: Array<SideNavItem> = []

  document.sections.forEach(section => {
    section.tasks.forEach(task => tasks.push({ href: `#${stringToKebabCase(task.title)}`, text: task.title }))
  })

  return tasks
}

export const getSideNavLinksForApplication = () => {
  const sections = getSections()

  const tasks: Array<SideNavItem> = []

  sections.forEach(section => {
    section.tasks.forEach(task => tasks.push({ href: `#${stringToKebabCase(task.title)}`, text: task.title }))
  })

  return tasks
}

export const stringToKebabCase = (stringToTransform: string) => {
  return stringToTransform.replace(/\s+/g, '-').toLowerCase()
}
