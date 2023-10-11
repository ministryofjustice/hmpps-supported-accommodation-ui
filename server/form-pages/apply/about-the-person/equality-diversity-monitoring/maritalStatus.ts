import type { TaskListErrors } from '@approved-premises/ui'
import { Cas2Application as Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { convertKeyValuePairToRadioItems } from '../../../../utils/formUtils'
import errorLookups from '../../../../i18n/en/errors.json'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { getQuestions } from '../../../utils/questions'

const applicationQuestions = getQuestions('')

export const options = applicationQuestions['equality-and-diversity-monitoring']['marital-status'].maritalStatus.answers

export type MaritalStatusBody = {
  maritalStatus: keyof typeof options
}

@Page({
  name: 'marital-status',
  bodyProperties: ['maritalStatus'],
})
export default class MaritalStatus implements TaskListPage {
  documentTitle = "What is the person's legal marital or registered civil partnership status?"

  personName = nameOrPlaceholderCopy(this.application.person)

  title = `Equality and diversity questions for ${this.personName}`

  questions = getQuestions(this.personName)['equality-and-diversity-monitoring']['marital-status']

  body: MaritalStatusBody

  constructor(
    body: Partial<MaritalStatusBody>,
    private readonly application: Application,
  ) {}

  previous() {
    return 'parental-carer-responsibilities'
  }

  next() {
    return ''
  }

  errors() {
    const errors: TaskListErrors<this> = {}
    if (!this.body.maritalStatus) {
      errors.maritalStatus = errorLookups.maritalStatus.empty
    }
    return errors
  }

  response() {
    return {
      [this.questions.maritalStatus.question]: options[this.body.maritalStatus],
    }
  }

  items() {
    const items = convertKeyValuePairToRadioItems(options, this.body.maritalStatus)

    const preferNotToSay = items.pop()
    items.push({ divider: 'or' })

    return [...items, { ...preferNotToSay }]
  }
}
