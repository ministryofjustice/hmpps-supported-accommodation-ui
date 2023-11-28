import { TaskListErrors } from '@approved-premises/ui'
import { Cas2Application as Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { getQuestions } from '../../../utils/questions'

type HDCLicenceDatesBody = {
  hdcEligibilityDate: string
  conditionalReleaseDate: string
}

@Page({
  name: 'hdc-licence-dates',
  bodyProperties: ['hdcEligibilityDate', 'conditionalReleaseDate'],
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

  errors() {
    const errors: TaskListErrors<this> = {}
    if (!this.body.hdcEligibilityDate) {
      errors.hdcEligibilityDate = "Enter the applicant's HDC eligibility date"
    }
    if (!this.body.conditionalReleaseDate) {
      errors.conditionalReleaseDate = "Enter the applicant's conditional release date"
    }
    return errors
  }
}
