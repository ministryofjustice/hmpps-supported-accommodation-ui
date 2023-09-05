import type { TaskListErrors } from '@approved-premises/ui'
import { Cas2Application as Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { AcctDataBody } from './custom-forms/acctData'
import { DateFormats } from '../../../../utils/dateUtils'

type AcctBody = Record<string, never>

type AcctUI = { referringInstitution: string; expiryDate: string; createdDate: string; acctDetails: string }

@Page({
  name: 'acct',
  bodyProperties: ['acctDetail'],
})
export default class Acct implements TaskListPage {
  title = 'Assessment, Care in Custody and Teamwork (ACCT)'

  body: AcctBody

  accts: AcctUI[]

  constructor(
    body: Partial<AcctBody>,
    private readonly application: Application,
  ) {
    if (application.data['risk-to-self'] && application.data['risk-to-self']['acct-data']) {
      const acctData = application.data['risk-to-self']['acct-data'] as [AcctDataBody]

      this.accts = acctData.map(acct => {
        return {
          referringInstitution: acct.referringInstitution,
          createdDate: DateFormats.dateAndTimeInputsToUiDate(acct, 'createdDate'),
          expiryDate: DateFormats.dateAndTimeInputsToUiDate(acct, 'expiryDate'),
          acctDetails: acct.acctDetails,
        }
      })
    }
    this.body = body as AcctBody
  }

  previous() {
    return 'historical-risk'
  }

  next() {
    return 'additional-information'
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    return errors
  }

  response() {
    const response = {}

    return response
  }
}
