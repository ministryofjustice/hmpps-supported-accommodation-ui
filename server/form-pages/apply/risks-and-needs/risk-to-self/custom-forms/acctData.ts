import type { TaskListErrors } from '@approved-premises/ui'
import { Cas2Application } from '@approved-premises/api'
import { Page } from '../../../../utils/decorators'
import TaskListPage from '../../../../taskListPage'
import { dateAndTimeInputsAreValidDates } from '../../../../../utils/dateUtils'

export type AcctDataBody = {
  referringInstitution: string
  createdDate: string
  'createdDate-day': string
  'createdDate-month': string
  'createdDate-year': string
  expiryDate: string
  'expiryDate-day': string
  'expiryDate-month': string
  'expiryDate-year': string
  acctDetails: string
}

@Page({
  name: 'acct-data',
  bodyProperties: [
    'referringInstitution',
    'createdDate-day',
    'createdDate-month',
    'createdDate-year',
    'expiryDate-day',
    'expiryDate-month',
    'expiryDate-year',
    'acctDetails',
  ],
})
export default class AcctData implements TaskListPage {
  title = 'Add an ACCT entry'

  body: AcctDataBody

  questions = {
    createdDate: {
      question: 'When was the ACCT created?',
    },
    expiryDate: {
      question: 'When did the ACCT expire?',
    },
    referringInstitution: {
      question: 'Referring institution',
      hint: 'Where the applicant was based at the time the ACCT was created',
    },
    acctDetail: {
      question: 'Details about the ACCT',
    },
  }

  taskName = 'risk-to-self'

  pageName = 'acct-data'

  constructor(
    body: Partial<AcctDataBody>,
    private readonly application: Cas2Application,
  ) {
    this.body = body as AcctDataBody
  }

  previous() {
    return 'acct'
  }

  next() {
    return 'acct'
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    if (!dateAndTimeInputsAreValidDates(this.body, 'createdDate')) {
      errors.createdDate = 'Add a valid created date, for example 2 3 2013'
    }
    if (!dateAndTimeInputsAreValidDates(this.body, 'expiryDate')) {
      errors.expiryDate = 'Add a valid expiry date, for example 2 3 2013'
    }
    if (!this.body.referringInstitution) {
      errors.referringInstitution = 'Add a referring institution'
    }
    if (!this.body.acctDetails) {
      errors.acctDetails = 'Enter the details of the ACCT'
    }

    return errors
  }

  response() {
    const response = this.application.data['risk-to-self']?.['acct-data'] || []

    return response
  }
}
