import type { TaskListErrors, YesNoOrDontKnow } from '@approved-premises/ui'
import { Cas2Application as Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { convertKeyValuePairToRadioItems } from '../../../../utils/formUtils'
import errorLookups from '../../../../i18n/en/errors.json'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'

export const options = {
  yes: 'Yes',
  no: 'No',
  dontKnow: `I don't know`,
}

export type ParentalCarerResponsibilitiesBody = {
  hasParentalOrCarerResponsibilities: YesNoOrDontKnow
}

@Page({
  name: 'parental-carer-responsibilities',
  bodyProperties: ['hasParentalOrCarerResponsibilities'],
})
export default class ParentalCarerResponsibilities implements TaskListPage {
  documentTitle = 'Does the person have parental or carer responsibilities?'

  personName = nameOrPlaceholderCopy(this.application.person)

  title = `Equality and diversity questions for ${this.personName}`

  questions = {
    hasParentalOrCarerResponsibilities: `Does ${this.personName} have parental or carer responsibilities?`,
  }

  body: ParentalCarerResponsibilitiesBody

  constructor(
    body: Partial<ParentalCarerResponsibilitiesBody>,
    private readonly application: Application,
  ) {}

  previous() {
    return 'care-leaver'
  }

  next() {
    return 'marital-status'
  }

  errors() {
    const errors: TaskListErrors<this> = {}
    if (!this.body.hasParentalOrCarerResponsibilities) {
      errors.hasParentalOrCarerResponsibilities = errorLookups.hasParentalOrCarerResponsibilities.empty
    }
    return errors
  }

  response() {
    return {
      [this.questions.hasParentalOrCarerResponsibilities]: options[this.body.hasParentalOrCarerResponsibilities],
    }
  }

  items() {
    const items = convertKeyValuePairToRadioItems(options, this.body.hasParentalOrCarerResponsibilities)

    const dontKnow = items.pop()
    items.push({ divider: 'or' })

    return [...items, { ...dontKnow }]
  }
}
