import type { Radio, TaskListErrors, YesOrNoOrPreferNotToSay } from '@approved-premises/ui'
import { Cas2Application as Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { convertKeyValuePairToRadioItems } from '../../../../utils/formUtils'
import errorLookups from '../../../../i18n/en/errors.json'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { getQuestions } from '../../../utils/questions'

const applicationQuestions = getQuestions('')

export const sexOptions = applicationQuestions['equality-and-diversity-monitoring']['sex-and-gender'].sex.answers

const genderOptions = applicationQuestions['equality-and-diversity-monitoring']['sex-and-gender'].gender.answers

type SexAndGenderBody = {
  sex: keyof typeof sexOptions
  gender: YesOrNoOrPreferNotToSay
  optionalGenderIdentity: string
}

@Page({
  name: 'sex-and-gender',
  bodyProperties: ['sex', 'gender', 'optionalGenderIdentity'],
})
export default class SexAndGender implements TaskListPage {
  documentTitle = "What is the person's sex?"

  personName = nameOrPlaceholderCopy(this.application.person)

  title = `Equality and diversity questions for ${this.personName}`

  heading = 'Sex and gender identity'

  questions = getQuestions(this.personName)['equality-and-diversity-monitoring']['sex-and-gender']

  body: SexAndGenderBody

  constructor(
    body: Partial<SexAndGenderBody>,
    private readonly application: Application,
  ) {
    this.body = body as SexAndGenderBody
  }

  previous() {
    return 'disability'
  }

  next() {
    return 'sexual-orientation'
  }

  errors() {
    const errors: TaskListErrors<this> = {}
    if (!this.body.sex) {
      errors.sex = errorLookups.sexAndGender.sex
    }
    if (!this.body.gender) {
      errors.gender = errorLookups.sexAndGender.gender
    }
    return errors
  }

  response() {
    const response = {
      [this.questions.sex.question]: sexOptions[this.body.sex],
      [this.questions.gender.question]: genderOptions[this.body.gender],
      [this.questions.optionalGenderIdentity.question]: this.body.optionalGenderIdentity,
    }

    return response
  }

  sexItems() {
    return convertKeyValuePairToRadioItems(sexOptions, this.body.sex)
  }

  genderItems(optionalGenderIdentity: string) {
    const radioItems = convertKeyValuePairToRadioItems(genderOptions, this.body.gender) as [Radio]
    radioItems.forEach(item => {
      if (item.value === 'no') {
        item.conditional = { html: optionalGenderIdentity }
      }
    })
    return radioItems
  }
}
