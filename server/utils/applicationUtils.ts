import type { Cas2Application as Application } from '@approved-premises/api'
import type { TableRow } from '@approved-premises/ui'
import paths from '../paths/apply'
import { DateFormats } from './dateUtils'
import { nameOrPlaceholderCopy } from './utils'

export const inProgressApplicationTableRows = (applications: Array<Application>): Array<TableRow> => {
  return applications.map(application => {
    return [
      nameAnchorElement(nameOrPlaceholderCopy(application.person), application.id),
      textValue(application.person.crn),
      textValue(DateFormats.isoDateToUIDate(application.createdAt, { format: 'medium' })),
    ]
  })
}

export const submittedApplicationTableRows = (applications: Array<Application>): Array<TableRow> => {
  return applications.map(application => {
    return [
      nameAnchorElement(nameOrPlaceholderCopy(application.person), application.id),
      textValue(application.person.crn),
      textValue(DateFormats.isoDateToUIDate(application.submittedAt, { format: 'medium' })),
    ]
  })
}

const htmlValue = (value: string) => {
  return { html: value }
}

const nameAnchorElement = (name: string, applicationId: string) => {
  return htmlValue(
    `<a href=${paths.applications.show({ id: applicationId })} data-cy-id="${applicationId}">${name}</a>`,
  )
}

const textValue = (value: string) => {
  return { text: value }
}
