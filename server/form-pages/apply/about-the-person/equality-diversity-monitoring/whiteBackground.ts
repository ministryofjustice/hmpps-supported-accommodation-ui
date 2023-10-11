import type { Radio, TaskListErrors } from '@approved-premises/ui'
import { Cas2Application as Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { convertKeyValuePairToRadioItems } from '../../../../utils/formUtils'
import errorLookups from '../../../../i18n/en/errors.json'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { getQuestions } from '../../../utils/questions'

const applicationQuestions = getQuestions('')

export const whiteBackgroundOptions =
  applicationQuestions['equality-and-diversity-monitoring']['white-background'].whiteBackground.answers

export type WhiteBackgroundBody = {
  whiteBackground: keyof typeof whiteBackgroundOptions
  optionalWhiteBackground: string
}

@Page({
  name: 'white-background',
  bodyProperties: ['whiteBackground', 'optionalWhiteBackground'],
})
export default class WhiteBackground implements TaskListPage {
  documentTitle = "Which of the following best describes the person's White background?"

  personName = nameOrPlaceholderCopy(this.application.person)

  title = `Equality and diversity questions for ${this.personName}`

  questions = getQuestions(this.personName)['equality-and-diversity-monitoring']['white-background']

  body: WhiteBackgroundBody

  constructor(
    body: Partial<WhiteBackgroundBody>,
    private readonly application: Application,
  ) {
    this.body = body as WhiteBackgroundBody
  }

  previous() {
    return 'ethnic-group'
  }

  next() {
    return 'religion'
  }

  errors() {
    const errors: TaskListErrors<this> = {}
    if (!this.body.whiteBackground) {
      errors.whiteBackground = errorLookups.background.empty
    }
    return errors
  }

  response() {
    const response = {
      [this.questions.whiteBackground.question]: whiteBackgroundOptions[this.body.whiteBackground],
      [this.questions.optionalWhiteBackground.question]: this.body.optionalWhiteBackground,
    }

    return response
  }

  items(optionalWhiteBackground: string) {
    const items = convertKeyValuePairToRadioItems(whiteBackgroundOptions, this.body.whiteBackground) as [Radio]

    items.forEach(item => {
      if (item.value === 'other') {
        item.conditional = { html: optionalWhiteBackground }
      }
    })
    const preferNotToSay = items.pop()

    return [...items, { divider: 'or' }, { ...preferNotToSay }]
  }
}
