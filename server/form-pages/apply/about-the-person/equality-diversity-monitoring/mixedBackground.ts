import type { Radio, TaskListErrors } from '@approved-premises/ui'
import { Cas2Application as Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { convertKeyValuePairToRadioItems } from '../../../../utils/formUtils'
import errorLookups from '../../../../i18n/en/errors.json'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { getQuestions } from '../../../utils/questions'

const applicationQuestions = getQuestions('')

export const mixedBackgroundOptions =
  applicationQuestions['equality-and-diversity-monitoring']['mixed-background'].mixedBackground.answers

export type MixedBackgroundBody = {
  mixedBackground: keyof typeof mixedBackgroundOptions
  optionalMixedBackground: string
}

@Page({
  name: 'mixed-background',
  bodyProperties: ['mixedBackground', 'optionalMixedBackground'],
})
export default class MixedBackground implements TaskListPage {
  documentTitle = "Which of the following best describes the person's mixed or multiple ethnic groups background?"

  personName = nameOrPlaceholderCopy(this.application.person)

  title = `Equality and diversity questions for ${this.personName}`

  questions = getQuestions(this.personName)['equality-and-diversity-monitoring']['mixed-background']

  body: MixedBackgroundBody

  constructor(
    body: Partial<MixedBackgroundBody>,
    private readonly application: Application,
  ) {
    this.body = body as MixedBackgroundBody
  }

  previous() {
    return 'ethnic-group'
  }

  next() {
    return 'religion'
  }

  errors() {
    const errors: TaskListErrors<this> = {}
    if (!this.body.mixedBackground) {
      errors.mixedBackground = errorLookups.background.empty
    }
    return errors
  }

  response() {
    const response = {
      [this.questions.mixedBackground.question]: mixedBackgroundOptions[this.body.mixedBackground],
      [this.questions.optionalMixedBackground.question]: this.body.optionalMixedBackground,
    }

    return response
  }

  items(optionalMixedBackground: string) {
    const items = convertKeyValuePairToRadioItems(mixedBackgroundOptions, this.body.mixedBackground) as [Radio]

    items.forEach(item => {
      if (item.value === 'other') {
        item.conditional = { html: optionalMixedBackground }
      }
    })
    const preferNotToSay = items.pop()

    return [...items, { divider: 'or' }, { ...preferNotToSay }]
  }
}
