import type { Radio, TaskListErrors } from '@approved-premises/ui'
import { Cas2Application as Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { convertKeyValuePairToRadioItems } from '../../../../utils/formUtils'
import errorLookups from '../../../../i18n/en/errors.json'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { getQuestions } from '../../../utils/questions'

const applicationQuestions = getQuestions('')

export const orientationOptions =
  applicationQuestions['equality-and-diversity-monitoring']['sexual-orientation'].orientation.answers

type SexualOrientationBody = {
  orientation: keyof typeof orientationOptions
  otherOrientation: string
}

@Page({
  name: 'sexual-orientation',
  bodyProperties: ['orientation', 'otherOrientation'],
})
export default class SexualOrientation implements TaskListPage {
  documentTitle = "Which of the following best describes the person's sexual orientation?"

  personName = nameOrPlaceholderCopy(this.application.person)

  title = `Equality and diversity questions for ${this.personName}`

  questions = getQuestions(this.personName)['equality-and-diversity-monitoring']['sexual-orientation']

  body: SexualOrientationBody

  constructor(
    body: Partial<SexualOrientationBody>,
    private readonly application: Application,
  ) {
    this.body = body as SexualOrientationBody
  }

  previous() {
    return 'sex-and-gender'
  }

  next() {
    return 'ethnic-group'
  }

  errors() {
    const errors: TaskListErrors<this> = {}
    if (!this.body.orientation) {
      errors.orientation = errorLookups.sexualOrientation.orientation
    }
    return errors
  }

  response() {
    const response = {
      [this.questions.orientation.question]: orientationOptions[this.body.orientation],
      [this.questions.otherOrientation.question]: this.body.otherOrientation,
    }

    return response
  }

  items(otherOrientationHtml: string) {
    const items = convertKeyValuePairToRadioItems(orientationOptions, this.body.orientation) as [Radio]
    items.forEach(item => {
      if (item.value === 'other') {
        item.conditional = { html: otherOrientationHtml }
      }
    })

    return items
  }
}
