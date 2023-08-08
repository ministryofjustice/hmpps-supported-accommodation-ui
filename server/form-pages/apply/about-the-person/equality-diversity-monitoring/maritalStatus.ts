import type { TaskListErrors } from '@approved-premises/ui'
import { Cas2Application as Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { convertKeyValuePairToRadioItems } from '../../../../utils/formUtils'
import errorLookups from '../../../../i18n/en/errors.json'

export type MaritalStatusBody = {
  maritalStatus:
    | 'neverMarried'
    | 'married'
    | 'inCivilPartnership'
    | 'marriedButSeparated'
    | 'inCivilPartnershipButSeparated'
    | 'divorced'
    | 'formerlyInCivilPartnershipNowDissolved'
    | 'widowed'
    | 'survivingPartnerFromCivilPartnership'
    | 'preferNotToSay'
}

export const options = {
  neverMarried: 'Never married and never registered in a civil partnership',
  married: 'Married',
  inCivilPartnership: 'In a registered civil partnership',
  marriedButSeparated: 'Separated, but still legally married',
  inCivilPartnershipButSeparated: 'Separated, but still legally in a civil partnership',
  divorced: 'Divorced',
  formerlyInCivilPartnershipNowDissolved: 'Formerly in a civil partnership which is now legally dissolved',
  widowed: 'Widowed',
  survivingPartnerFromCivilPartnership: 'Surviving partner from a registered civil partnership',
  preferNotToSay: 'Prefer not to say',
}

@Page({
  name: 'marital-status',
  bodyProperties: ['maritalStatus'],
})
export default class MaritalStatus implements TaskListPage {
  title = `Equality and diversity questions for ${this.application.person.name}`

  questions = {
    maritalStatus: `What is ${this.application.person.name}'s legal marital or registered civil partnership status?`,
  }

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
      [this.questions.maritalStatus]: options[this.body.maritalStatus],
    }
  }

  items() {
    const items = convertKeyValuePairToRadioItems(options, this.body.maritalStatus)

    const preferNotToSay = items.pop()
    items.push({ divider: 'or' })

    return [...items, { ...preferNotToSay }]
  }
}