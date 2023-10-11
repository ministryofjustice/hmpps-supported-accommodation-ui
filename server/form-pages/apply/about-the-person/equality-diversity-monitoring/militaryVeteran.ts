import type { TaskListErrors, YesNoOrDontKnow } from '@approved-premises/ui'
import { Cas2Application as Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { convertKeyValuePairToRadioItems } from '../../../../utils/formUtils'
import errorLookups from '../../../../i18n/en/errors.json'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { getQuestions } from '../../../utils/questions'

const applicationQuestions = getQuestions('')

export const options = applicationQuestions['equality-and-diversity-monitoring']['military-veteran'].isVeteran.answers

export type MilitaryVeteranBody = {
  isVeteran: YesNoOrDontKnow
}

@Page({
  name: 'military-veteran',
  bodyProperties: ['isVeteran'],
})
export default class MilitaryVeteran implements TaskListPage {
  documentTitle = 'Is the person a military veteran?'

  personName = nameOrPlaceholderCopy(this.application.person)

  title = `Equality and diversity questions for ${this.personName}`

  questions = getQuestions(this.personName)['equality-and-diversity-monitoring']['military-veteran']

  body: MilitaryVeteranBody

  constructor(
    body: Partial<MilitaryVeteranBody>,
    private readonly application: Application,
  ) {}

  previous() {
    return 'religion'
  }

  next() {
    return 'care-leaver'
  }

  errors() {
    const errors: TaskListErrors<this> = {}
    if (!this.body.isVeteran) {
      errors.isVeteran = errorLookups.isVeteran.empty
    }
    return errors
  }

  response() {
    return {
      [this.questions.isVeteran.question]: options[this.body.isVeteran],
    }
  }

  items() {
    const items = convertKeyValuePairToRadioItems(options, this.body.isVeteran)

    const dontKnow = items.pop()
    items.push({ divider: 'or' })

    return [...items, { ...dontKnow }]
  }
}
