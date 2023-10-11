import type { Radio, TaskListErrors } from '@approved-premises/ui'
import { Cas2Application as Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { convertKeyValuePairToRadioItems } from '../../../../utils/formUtils'
import errorLookups from '../../../../i18n/en/errors.json'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { getQuestions } from '../../../utils/questions'

const applicationQuestions = getQuestions('')

export const blackBackgroundOptions =
  applicationQuestions['equality-and-diversity-monitoring']['black-background'].blackBackground.answers

export type BlackBackgroundBody = {
  blackBackground: keyof typeof blackBackgroundOptions
  optionalBlackBackground: string
}

@Page({
  name: 'black-background',
  bodyProperties: ['blackBackground', 'optionalBlackBackground'],
})
export default class BlackBackground implements TaskListPage {
  documentTitle =
    "Which of the following best describes the person's Black, African, Caribbean or Black British background?"

  personName = nameOrPlaceholderCopy(this.application.person)

  title = `Equality and diversity questions for ${this.personName}`

  questions = getQuestions(this.personName)['equality-and-diversity-monitoring']['black-background']

  body: BlackBackgroundBody

  constructor(
    body: Partial<BlackBackgroundBody>,
    private readonly application: Application,
  ) {
    this.body = body as BlackBackgroundBody
  }

  previous() {
    return 'ethnic-group'
  }

  next() {
    return 'religion'
  }

  errors() {
    const errors: TaskListErrors<this> = {}
    if (!this.body.blackBackground) {
      errors.blackBackground = errorLookups.background.empty
    }
    return errors
  }

  response() {
    const response = {
      [this.questions.blackBackground.question]: blackBackgroundOptions[this.body.blackBackground],
      [this.questions.optionalBlackBackground.question]: this.body.optionalBlackBackground,
    }

    return response
  }

  items(optionalBlackBackground: string) {
    const items = convertKeyValuePairToRadioItems(blackBackgroundOptions, this.body.blackBackground) as [Radio]

    items.forEach(item => {
      if (item.value === 'other') {
        item.conditional = { html: optionalBlackBackground }
      }
    })
    const preferNotToSay = items.pop()

    return [...items, { divider: 'or' }, { ...preferNotToSay }]
  }
}
