import type { Radio, TaskListErrors } from '@approved-premises/ui'
import { Cas2Application as Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { convertKeyValuePairToRadioItems } from '../../../../utils/formUtils'
import errorLookups from '../../../../i18n/en/errors.json'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { getQuestions } from '../../../utils/questions'

const applicationQuestions = getQuestions('')

const options = applicationQuestions['equality-and-diversity-monitoring']['asian-background'].asianBackground.answers

export type AsianBackgroundBody = {
  asianBackground: keyof typeof options
  optionalAsianBackground: string
}
@Page({
  name: 'asian-background',
  bodyProperties: ['asianBackground', 'optionalAsianBackground'],
})
export default class AsianBackground implements TaskListPage {
  documentTitle = "Which of the following best describes the person's Asian or Asian British background?"

  personName = nameOrPlaceholderCopy(this.application.person)

  title = `Equality and diversity questions for ${this.personName}`

  questions = getQuestions(this.personName)['equality-and-diversity-monitoring']['asian-background']

  body: AsianBackgroundBody

  constructor(
    body: Partial<AsianBackgroundBody>,
    private readonly application: Application,
  ) {
    this.body = body as AsianBackgroundBody
  }

  previous() {
    return 'ethnic-group'
  }

  next() {
    return 'religion'
  }

  errors() {
    const errors: TaskListErrors<this> = {}
    if (!this.body.asianBackground) {
      errors.asianBackground = errorLookups.background.empty
    }
    return errors
  }

  response() {
    const response = {
      [this.questions.asianBackground.question]: options[this.body.asianBackground],
      [this.questions.optionalAsianBackground.question]: this.body.optionalAsianBackground,
    }

    return response
  }

  items(optionalAsianBackground: string) {
    const items = convertKeyValuePairToRadioItems(options, this.body.asianBackground) as [Radio]

    items.forEach(item => {
      if (item.value === 'other') {
        item.conditional = { html: optionalAsianBackground }
      }
    })
    const preferNotToSay = items.pop()

    return [...items, { divider: 'or' }, { ...preferNotToSay }]
  }
}
