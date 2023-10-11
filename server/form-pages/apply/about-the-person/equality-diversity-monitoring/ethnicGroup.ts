import type { TaskListErrors } from '@approved-premises/ui'
import { Cas2Application as Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { convertKeyValuePairToRadioItems } from '../../../../utils/formUtils'
import errorLookups from '../../../../i18n/en/errors.json'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { getQuestions } from '../../../utils/questions'

const applicationQuestions = getQuestions('')

export const ethnicGroupOptions =
  applicationQuestions['equality-and-diversity-monitoring']['ethnic-group'].ethnicGroup.answers

export type EthnicGroupBody = {
  ethnicGroup: keyof typeof ethnicGroupOptions
}

@Page({
  name: 'ethnic-group',
  bodyProperties: ['ethnicGroup'],
})
export default class EthnicGroup implements TaskListPage {
  documentTitle = "What is the person's ethnic group?"

  personName = nameOrPlaceholderCopy(this.application.person)

  title = `Equality and diversity questions for ${this.personName}`

  questions = getQuestions(this.personName)['equality-and-diversity-monitoring']['ethnic-group']

  body: EthnicGroupBody

  constructor(
    body: Partial<EthnicGroupBody>,
    private readonly application: Application,
  ) {
    this.body = body as EthnicGroupBody
  }

  previous() {
    return 'sexual-orientation'
  }

  next() {
    const ethnicGroupNext = {
      white: 'white-background',
      mixed: 'mixed-background',
      asian: 'asian-background',
      black: 'black-background',
      other: 'other-background',
    }
    if (ethnicGroupNext[this.body.ethnicGroup]) {
      return ethnicGroupNext[this.body.ethnicGroup]
    }
    return 'religion'
  }

  errors() {
    const errors: TaskListErrors<this> = {}
    if (!this.body.ethnicGroup) {
      errors.ethnicGroup = errorLookups.ethnicGroup.empty
    }
    return errors
  }

  response() {
    const response = {
      [this.questions.ethnicGroup.question]: ethnicGroupOptions[this.body.ethnicGroup],
    }

    return response
  }

  items() {
    const items = convertKeyValuePairToRadioItems(ethnicGroupOptions, this.body.ethnicGroup)

    const preferNotToSay = items.pop()
    items.push({ divider: 'or' })

    return [...items, { ...preferNotToSay }]
  }
}
