import { TaskListErrors } from '@approved-premises/ui'
import { Cas2Application as Application } from '@approved-premises/api'
import type { ObjectWithDateParts } from '@approved-premises/ui'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { getQuestions } from '../../../utils/questions'
import { dateAndTimeInputsAreValidDates, DateFormats } from '../../../../utils/dateUtils'
import { dateBodyProperties } from '../../../utils'

type HDCLicenceDatesBody = ObjectWithDateParts<'hdcEligibilityDate'> & ObjectWithDateParts<'conditionalReleaseDate'>

@Page({
  name: 'hdc-licence-dates',
  bodyProperties: [...dateBodyProperties('hdcEligibilityDate'), ...dateBodyProperties('conditionalReleaseDate')],
})
export default class HDCLicenceDates implements TaskListPage {
  documentTitle = 'Home Detention Curfew (HDC) licence dates'

  personName = nameOrPlaceholderCopy(this.application.person)

  title = `${this.personName}'s Home Detention Curfew (HDC) licence dates`

  questions = getQuestions(this.personName)['hdc-licence-and-cpp-details']['hdc-licence-dates']

  options: Record<string, string>

  body: HDCLicenceDatesBody

  constructor(
    body: Partial<HDCLicenceDatesBody>,
    private readonly application: Application,
  ) {
    this.body = body as HDCLicenceDatesBody
  }

  previous() {
    return 'taskList'
  }

  next() {
    return ''
  }

  response() {
    return {
      'HDC eligibility date': DateFormats.dateAndTimeInputsToUiDate(this.body, 'hdcEligibilityDate'),
      'Conditional release date': DateFormats.dateAndTimeInputsToUiDate(this.body, 'conditionalReleaseDate'),
    }
  }

  errors() {
    const errors: TaskListErrors<this> = {}
    if (!dateAndTimeInputsAreValidDates(this.body, 'hdcEligibilityDate')) {
      errors.hdcEligibilityDate = "Enter the applicant's HDC eligibility date"
    }
    if (!dateAndTimeInputsAreValidDates(this.body, 'conditionalReleaseDate')) {
      errors.conditionalReleaseDate = "Enter the applicant's conditional release date"
    }
    return errors
  }
}
